const sequelize = require("../data/db")
const {DataTypes} = require("sequelize");

const Roles = sequelize.define("roles",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    roleName:{
        type:DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps:false
})

module.exports = Roles;