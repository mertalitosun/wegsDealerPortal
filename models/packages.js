const sequelize = require("../data/db")
const {DataTypes} = require("sequelize");

const Packages = sequelize.define("packages",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    packageName:{
        type:DataTypes.STRING,
        allowNull: false
    },
    packagePrice:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    }
},{
    timestamps:false
})

module.exports = Packages;