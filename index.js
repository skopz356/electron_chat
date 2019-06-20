const models = require("./bin/models");

const ejs = require("ejs-electron");


ejs.data("x", [5, 6, 6])

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url');


let win;
function isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1;
};
function createWindow() {
    win = new BrowserWindow({
        width: 800, height: 600, webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/dist/index.ejs'),
        protocol: 'file',
        slashes: true
    }));
    if (isDev()) {
        win.webContents.openDevTools()
    }
    win.on('closed', () => {
        win = null
    })
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

ipcMain.on('submitForm', function (event, data) {
    for (const [key, value] of data.entries()) {
        data[value["name"]] = value["value"];
        data.splice( key, 1 );
    }

    console.log(data);
    models.Article.create(data);
});