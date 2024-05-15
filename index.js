const electron = require('electron');

const {app} = electron;

app.on('ready', () => {
    console.log('The application is ready.');
});