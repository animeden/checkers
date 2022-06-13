module.exports = (sequelize, Sequelize) =>{

    const Notification = sequelize.define("notifications",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        sender:{
            type: Sequelize.INTEGER
        },
        receiver:{
            type: Sequelize.INTEGER
        },
        type:{
            type: Sequelize.STRING
        },
        read:{
            type: Sequelize.STRING
        },
        sendername:{
            type: Sequelize.STRING
        },
        senderimage:{
            type: Sequelize.STRING
        }
    });

    return Notification
}