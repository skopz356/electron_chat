const Sequelize = require('sequelize');
const seq = new Sequelize('electron_chat', 'root', 'mysql', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = {
    sequelize: seq,
}