const config = require("../config");
const Sequelize = require('sequelize');

const sequelize = config.sequelize;

class User extends Sequelize.Model { };
class Article extends Sequelize.Model {};

User.init({
    username: Sequelize.STRING,
    password: Sequelize.TEXT
}, { sequelize, modelName: 'user' });

Article.init({
    title: Sequelize.STRING,
    subtitle: Sequelize.STRING,
    text: Sequelize.TEXT
}, {sequelize, modelName: 'article'})

Article.all = (callback) => {
    Article.findAll({
        order: [
            ["createdAt", "DESC"],
        ]
    }).then(callback)
}

sequelize.sync();

module.exports = {
    Article
}

