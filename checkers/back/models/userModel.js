module.exports = (sequelize, Sequelize) =>{

    const User = sequelize.define("users",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        login:{
            type: Sequelize.STRING,
            unique: true
        },
        password:{
            type: Sequelize.STRING
        },
        wins:{
            type: Sequelize.INTEGER
        },
        loses:{
            type: Sequelize.INTEGER
        },
        matches: {
          type: Sequelize.INTEGER
        },
        ratingPoints: {
            type: Sequelize.INTEGER
        },
        image:{
            type: Sequelize.STRING
        },
        room:{
            type: Sequelize.STRING
        }
    });

    return User
}