const Users = require("../models/users");
const Customers = require("../models/customers");
const Dealers = require("../models/dealers");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

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
            {firstName: "mehmet", lastName: "namal", email: "mehmet@mail.com",dealerCommission:0.10,subDealerCommission:0.05,referenceCode : shortid.generate()},
            {firstName: "ahmet", lastName: "namal", email: "ahmet@mail.com",referenceBy:1,dealerCommission:0.10,subDealerCommission:0.05,referenceCode : shortid.generate()},
            {firstName: "şefik", lastName: "merpez", email: "sefik@mail.com",referenceBy:2,dealerCommission:0.10,subDealerCommission:0.05,referenceCode : shortid.generate()},
        ]);
    }
    const customerCount = await Customers.count();
    if(customerCount == 0){
        await Customers.bulkCreate([
            { firstName: "Emre", lastName: "yılmaz",organization:"Atlas Lojistik",addedBy:2,price:50, agreementDate: new Date("2024-07-25") },
            { firstName: "Burak", lastName: "ocak",organization:"Modern Mobilya",addedBy:1,price:400, agreementDate: new Date("2024-07-23") },
            { firstName: "Demir", lastName: "At",organization:"Güçlü Elektrik",addedBy:2,price:750, agreementDate: new Date("2024-06-25") },

            { firstName: "Serkan", lastName: "Koyuncu",organization:"Net Yazılım",addedBy:3,price:500, agreementDate: new Date("2024-07-25") },
            { firstName: "Baran", lastName: "Kurt",organization:"Gelişim İnşaat",addedBy:1,price:1250, agreementDate: new Date("2024-08-10")},
            { firstName: "Oğuz", lastName: "Tekin",organization:"Asil Yatırım",addedBy:3,price:1000, agreementDate: new Date("2024-08-16")},
            { firstName: "İlker", lastName: "Demirtaş",organization:"Nova Bilgisayar",addedBy:3,price:150, agreementDate: new Date("2024-07-25")},
        ]);
    }
};

module.exports = dummyData;
