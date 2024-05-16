const {ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    //Todo: implement the other methods
    //Todo: Optimize the code
    todo: {
        add: (todo) => ipcRenderer.send('todo:add', todo),
        clear: () => ipcRenderer.on('todo:clear', () => {
            document.querySelector('ul').innerHTML = '';
        }),
        receiveTodo: (callback) => ipcRenderer.on('todo:add', (event, todo) => callback(todo)),
    }
});