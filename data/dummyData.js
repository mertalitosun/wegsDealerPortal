const Users = require("../models/users");
const Customers = require("../models/customers");
const Dealers = require("../models/dealers");
const bcrypt = require("bcrypt");

const dummyData = async () => {
    const usersCount = await Users.count();
    if (usersCount == 0) {
        const users = await Users.bulkCreate(
        [{ firstName: "mertali", lastName: "tosun", email: "mertali@mail.com", password: await bcrypt.hash("123456", 10)}]);
    }
    const dealersCount = await Dealers.count();
    if (dealersCount == 0) {
        await Dealers.bulkCreate(
        [
            {firstName: "mehmet", lastName: "namal", email: "mehmet@mail.com",dealerCommission:0.10,subDealerCommission:0.05},
            {firstName: "ahmet", lastName: "namal", email: "ahmet@mail.com",referenceBy:1,dealerCommission:0.10,subDealerCommission:0.05},
            {firstName: "şefik", lastName: "merpez", email: "sefik@mail.com",referenceBy:2,dealerCommission:0.10,subDealerCommission:0.05},
        ]);
    }
    const customerCount = await Customers.count();
    if(customerCount == 0){
        await Customers.bulkCreate([
            { firstName: "Emre", lastName: "yılmaz",organization:"Atlas Lojistik",addedBy:2,price:50 },
            { firstName: "Burak", lastName: "ocak",organization:"Modern Mobilya",addedBy:1,price:400 },
            { firstName: "Demir", lastName: "At",organization:"Güçlü Elektrik",addedBy:2,price:750 },

            { firstName: "Serkan", lastName: "Koyuncu",organization:"Net Yazılım",addedBy:3,price:500 },
            { firstName: "Baran", lastName: "Kurt",organization:"Gelişim İnşaat",addedBy:1,price:1250},
            { firstName: "Oğuz", lastName: "Tekin",organization:"Asil Yatırım",addedBy:3,price:1000},
            { firstName: "İlker", lastName: "Demirtaş",organization:"Nova Bilgisayar",addedBy:3,price:150},
        ]);
    }
};

module.exports = dummyData;
