const Users = require("../models/users");
const Customers = require("../models/customers");
const Dealers = require("../models/dealers");
const Purchases = require("../models/purchases");
const Roles = require("../models/roles");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const dummyData = async () => {
    const rolesCount = await Roles.count();
    if(rolesCount == 0){
        const roles = await Roles.bulkCreate([
            {roleName:"Admin"},
            {roleName:"Moderatör"}
        ])
        const usersCount = await Users.count();
        if (usersCount == 0) {
            const users = await Users.bulkCreate(
            [{ firstName: "mertali", lastName: "tosun", email: "mertali@mail.com", password: await bcrypt.hash("123456", 10)}]);
            
            
            await users[0].addRoles([roles[0]]);

        }
    }
    
    const dealersCount = await Dealers.count();
    if (dealersCount == 0) {
        await Dealers.bulkCreate(
        [
      
            {dealerCode : `DLR-${shortid.generate()}`, firstName: "mehmet", lastName: "namal", email: "mehmet@mail.com",dealerCommission:0.10,subDealerCommission:0.05},
            {dealerCode : `DLR-${shortid.generate()}`, firstName: "ahmet", lastName: "namal", email: "ahmet@mail.com",referenceBy:1,dealerCommission:0.10,subDealerCommission:0.05},
            {dealerCode : `DLR-${shortid.generate()}`, firstName: "şefik", lastName: "merpez", email: "sefik@mail.com",referenceBy:2,dealerCommission:0.10,subDealerCommission:0.05},
        ]);
    }

    const customerCount = await Customers.count();
    if(customerCount == 0){
        await Customers.bulkCreate([
            {customerCode : `CSR-${shortid.generate()}`, firstName: "Emre", lastName: "yılmaz",organization:"Atlas Lojistik",addedBy:2},
            {customerCode : `CSR-${shortid.generate()}`, firstName: "Burak", lastName: "ocak",organization:"Modern Mobilya",addedBy:1},
            {customerCode : `CSR-${shortid.generate()}`, firstName: "Demir", lastName: "At",organization:"Güçlü Elektrik",addedBy:2},
            
            {customerCode : `CSR-${shortid.generate()}`, firstName: "Serkan", lastName: "Koyuncu",organization:"Net Yazılım",addedBy:3},
            {customerCode : `CSR-${shortid.generate()}`, firstName: "Baran", lastName: "Kurt",organization:"Gelişim İnşaat",addedBy:1},
            {customerCode : `CSR-${shortid.generate()}`, firstName: "Oğuz", lastName: "Tekin",organization:"Asil Yatırım",addedBy:3},
            {customerCode : `CSR-${shortid.generate()}`, firstName: "İlker", lastName: "Demirtaş",organization:"Nova Bilgisayar",addedBy:3},
        ]);
    }
    const purchasesCount = await Purchases.count();
    if(purchasesCount == 0){
        await Purchases.bulkCreate([
            {purchaseCode : `PRC-${shortid.generate()}`, productName: "1000 Kontör", price:500, purchaseDate: new Date("2024-07-25"),customerId:1},
            {purchaseCode : `PRC-${shortid.generate()}`, productName: "Ön Muhasebe", price:1000, purchaseDate: new Date("2024-07-13"),customerId:2},
            { purchaseCode : `PRC-${shortid.generate()}`,productName: "Sadece Fatura", price:500, purchaseDate: new Date("2024-08-15"),customerId:3},
            { purchaseCode : `PRC-${shortid.generate()}`,productName: "1000 Kontör", price:500, purchaseDate: new Date("2024-07-25"),customerId:4},
            {purchaseCode : `PRC-${shortid.generate()}`, productName: "1000 Kontör", price:500, purchaseDate: new Date("2024-07-25"),customerId:5},
            {purchaseCode : `PRC-${shortid.generate()}`, productName: "1000 Kontör", price:750, purchaseDate: new Date("2024-07-25"),customerId:6},
            {purchaseCode : `PRC-${shortid.generate()}`, productName: "1000 Kontör", price:500, purchaseDate: new Date("2024-07-25"),customerId:7},
        ])
    
    }
};

module.exports = dummyData;
