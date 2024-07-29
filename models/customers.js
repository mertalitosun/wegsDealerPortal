const sequelize = require("../data/db")
const {DataTypes} = require("sequelize");

const Customers = sequelize.define("customers",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    customerCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    firstName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lastName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    organization:{
        type:DataTypes.STRING,
        allowNull:false
    },
    addedBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
})

module.exports = Customers;