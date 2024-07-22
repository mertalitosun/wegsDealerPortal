const sequelize = require("../data/db")
const {DataTypes} = require("sequelize");

const CommissionRates = sequelize.define("commissionRates",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull: false
    },
    rate:{
        type:DataTypes.DECIMAL(4,2),
        allowNull:false
    }
},{
    timestamps:false
})

module.exports = CommissionRates;