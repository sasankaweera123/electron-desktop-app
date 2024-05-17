const electron = require('electron');
const {app, BrowserWindow, ipcMain,shell} = electron;
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            backgroundThrottling: false
        }
    });
    mainWindow.loadURL(path.join('file://', __dirname, '/src/index.html'));
});

ipcMain.on('videos-added', (event, videos) => {
    const promises = videos.map(video => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(video.path, (err, metadata) => {
                video.duration = metadata.format.duration;
                video.format = 'avi';
                resolve(video);
            });
        });
    });
    Promise.all(promises)
        .then((results) => {
            mainWindow.webContents.send('metadata:complete', results);
        });
});

ipcMain.on('conversion:start', (event, videos) => {
    videos.forEach(video => {
        const outputName = video.name.split('.')[0];
        const outputDir = path.join(video.path, '../');
        const outputPath = path.join(outputDir, `${outputName}.${video.format}`);
        ffmpeg(video.path)
            .output(outputPath)
            .on('progress', ({timemark}) => {
                mainWindow.webContents.send('conversion:progress', {video, timemark});
            })
            .on('end', () => {
                mainWindow.webContents.send('conversion:end', {video, outputPath});
            })
            .run();
    });
});

ipcMain.on('showInFolder', (event, outputPath) => {
    shell.showItemInFolder(outputPath);
});