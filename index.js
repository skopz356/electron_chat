const models = require("./bin/models");
const Sequelize = require('sequelize');
const ejs = require("ejs-electron");
const base_ejs = require("ejs");
const Op = Sequelize.Op;

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const moment = require("moment");

let win;
function isDev() {
    return false;
    return process.mainModule.filename.indexOf('app.asar') === -1;
};

function createWindow() {
    models.Article.findAll({
        order: [
            ["createdAt", "DESC"],
        ]
    }).then(objects => {
        ejs.data("articles", objects);
        ejs.data("moment", moment);
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
});
app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

ipcMain.on('submitForm', (event, data) => {
    let newData = {};
    for (let i = 0; i < data.length; i++) {
        newData[data[i]["name"]] = data[i]["value"];
    }

    models.Article.create(newData);
});

ipcMain.on("getArticles", (event, data) => {
    function after(articles) {
        html = base_ejs.renderFile(__dirname + "/dist/components/article_box.ejs", { articles: articles, moment: moment }, (err, html) => {
            event.sender.send('asynchronous-reply', html);
        });
    }

    if (data === null) {
        models.Article.findAll({}).then(after);
    }
    else if ("filter_date" in data) {
        models.Article.findAll({
            order: [
                ["createdAt", data["filter_date"]],
            ]
        }).then(after);
    }
    else if ("filter_attr" in data) {
        let obj = {};
        obj[data["filter_attr"][0]] = {
            [Op.like]: data["filter_attr"][1]
        }
        models.Article.findAll({
            where: obj
        }).then(after);


    } else {
        models.Article.findAll({
            where: {
                createdAt: {
                    [Op.gt]: data
                }
            }
        }).then(after);
    }
});