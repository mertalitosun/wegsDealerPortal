const sequelize = require("../data/db")
const {DataTypes} = require("sequelize");

const Users = sequelize.define("users",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    firstName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lastName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    referenceCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    referenceBy:{
        type:DataTypes.STRING,
        allowNull:true
    },
    
})

module.exports = Users;