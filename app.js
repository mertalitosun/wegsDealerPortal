const express = require("express");
const app = express();
const path = require("path");
const sequelize = require("./data/db");
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);




//Veritabanı
const Users = require("./models/users");
const Customers = require("./models/customers");
const Dealers = require("./models/dealers");

Dealers.belongsTo(Dealers, { as: 'reference', foreignKey: 'referenceBy', targetKey: 'id' });
//müşteri - bayi
Customers.belongsTo(Dealers, { foreignKey: 'addedBy'});
Dealers.hasMany(Customers, { foreignKey: 'addedBy'});






app.set("view engine", "ejs");
app.use(express.static("node_modules"));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); 
app.use(express.urlencoded({ extended: true }));



// Routes
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 30 * 60
  },
  store: new SequelizeStore({
    db: sequelize,
    expiration: 1000 * 60 * 30,
    checkExpirationInterval: 1000 * 60 * 30 
  })
}));
app.use(require("./middlewares/locals"));

app.use(authRoutes);
app.use(adminRoutes);

// (async () => {
//   await sequelize.sync({ force: true });
//   await require("./data/dummyData")();
// })();



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
