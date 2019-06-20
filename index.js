const models = require("./bin/models");

const ejs = require("ejs-electron");


let articles;
models.Article.findAll({
}).then(objects => {
    articles = objects
});

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url');


let win;
function isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1;
};
function createWindow() {
    models.Article.findAll({
    }).then(objects => {
        ejs.data("articles", objects);
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
        });
    });

};


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

ipcMain.on('submitForm',  (event, data) => {
    let newData = {};
    for (let i = 0; i < data.length; i++) {
        console.log(i);
        newData[data[i]["name"]] = data[i]["value"];
    }

    models.Article.create(newData);
});

ipcMain.on("getArticles", (event, data) => {
    return "asdasdasd";
});