const Sequelize = require("sequelize")

const sequelize = new Sequelize("checkers", "root", "1821anime", {
        host: "mysql",
        port: 3306,
        multipleStatements: true,
        dialect: 'mysql'
    }
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.friend = require("./friendModel")(sequelize, Sequelize);
db.notification = require("./notifationModel")(sequelize, Sequelize);
db.board = require("./boardSaves")(sequelize, Sequelize);
db.user = require("./userModel")(sequelize, Sequelize);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
})
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = db;