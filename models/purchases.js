const sequelize = require("../data/db")
const { DataTypes } = require("sequelize");

const Purchases = sequelize.define("purchases", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    purchaseCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Purchases;
