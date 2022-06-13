module.exports = (sequelize, Sequelize) =>{

    const Friend = sequelize.define("friends",{
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
        status:{
            type: Sequelize.STRING
        }
    });

    return Friend
}