const Sequelize = require('sequelize');
const seq = new Sequelize('electron_chat', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = {
    sequelize: seq,
}