module.exports = (sequelize, Sequelize) =>{

    const Board = sequelize.define("boards",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        room:{
            type: Sequelize.STRING
        },
        board:{
            type: Sequelize.STRING
        },
        status:{
            type: Sequelize.STRING
        },
        turn:{
            type: Sequelize.STRING
        }
    });

    return Board
}