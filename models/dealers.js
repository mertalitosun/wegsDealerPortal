const sequelize = require("../data/db")
const {DataTypes} = require("sequelize");

const Dealers = sequelize.define("dealers",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    dealerCode:{
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
    status:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
        allowNull:false
    },
    statusDescription:{
        type:DataTypes.STRING,
        allowNull: true
    }
})

module.exports = Dealers;