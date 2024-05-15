const {ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    submitVideo: (path) => {
        ipcRenderer.send('video:submit', path);
    },
    receiveMetadata: (callback) => {
        ipcRenderer.on('video:metadata', (event, metadata) => {
            callback(metadata);
        });
    }
});