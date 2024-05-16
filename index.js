const electron = require('electron');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let addWindow;

const isDev = process.env.NODE_ENV === 'development';

/**
 * Create the main window when the application is ready.
 */
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`).then(() => {
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Quit the application when the main window is closed.
    mainWindow.on('closed', () => app.quit());

    // Create the application menu.
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
}

/**
 * Menu template for the application.
 * @type {[{submenu: [{label: string},{accelerator: (string), label: string, click(): void}], label: string}]}
 */
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add New Todo',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

/**
 * Add an empty object to the beginning of the menuTemplate array if the platform is macOS.
 */
if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}