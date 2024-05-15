const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const {app, BrowserWindow, ipcMain} = electron;

let mainWindow;

const isDev = process.env.NODE_ENV === 'development';

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`).then(() => {
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    });
});

ipcMain.on('video:submit', (event, path) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
        mainWindow.webContents.send('video:metadata', metadata.format);
    });
});