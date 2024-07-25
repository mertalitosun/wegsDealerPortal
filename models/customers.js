const sequelize = require("../data/db")
const {DataTypes} = require("sequelize");

const Customers = sequelize.define("customers",{
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
    organization:{
        type:DataTypes.STRING,
        allowNull:false
    },
    addedBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    price:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    agreementDate:{
        type:DataTypes.DATE,
        allowNull:false
    },
})

module.exports = Customers;