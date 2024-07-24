const sequelize = require("../data/db")
const {DataTypes} = require("sequelize");

const Dealers = sequelize.define("dealers",{
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
    dealerCommission:{
        type:DataTypes.DECIMAL(4,2)
    },
    subDealerCommission:{
        type:DataTypes.DECIMAL(4,2)
    },
    referenceBy:{
        type:DataTypes.INTEGER,
        allowNull:true
    },  
})

module.exports = Dealers;