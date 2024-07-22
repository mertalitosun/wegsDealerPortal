const Users = require("../models/users");
const Roles = require("../models/roles");
const Customers = require("../models/customers");
const Packages = require("../models/packages");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const dummyData = async () => {
   
        const roleCount = await Roles.count();
        if (roleCount === 0) {
            const roles = await Roles.bulkCreate([
                { roleName: "Admin"},
                { roleName: "Bayi"},
                { roleName: "Alt Bayi"},
            ]);
            const usersCount = await Users.count();
            if (usersCount === 0) {
                const referenceCode = shortid.generate()
                const users = await Users.bulkCreate([
                    { firstName: "mertali", lastName: "tosun", email: "mertali@mail.com", password: await bcrypt.hash("123456", 10), referenceCode: shortid.generate() },
                    { firstName: "mehmet", lastName: "namal", email: "mehmet@mail.com", password: await bcrypt.hash("123456", 10), referenceCode: referenceCode,},
                    { firstName: "ahmet", lastName: "namal", email: "ahmet@mail.com", password: await bcrypt.hash("123456", 10), referenceCode: shortid.generate(), referenceBy:referenceCode,}
                ]);
                await users[0].addRoles([roles[0]]);

                await users[1].addRoles([roles[1]]);

                await users[2].addRoles([roles[1]]);
                await users[2].addRoles([roles[2]]);
            }
        }
    const packageCount = await Packages.count();
    if (packageCount == 0) {
        await Packages.bulkCreate([
            { packageName: "Sadece Fatura", packagePrice: 50 },
            { packageName: "Ön Muhasebe", packagePrice: 400 },
            { packageName: "Muhasebe + Pazaryeri Entegrasyonu", packagePrice: 750},
        ]);
    }
    const customerCount = await Customers.count();
    if(customerCount == 0){
        await Customers.bulkCreate([
            { firstName: "Emre", lastName: "yılmaz",organization:"Atlas Lojistik",email:"emre.yilmaz@example.com",phone:"0504-123-4567",addedBy:2,packageId:1 },
            { firstName: "Burak", lastName: "ocak",organization:"Modern Mobilya",email:"burak.ocak@example.com",phone:"0506-123-4567",addedBy:2,packageId:3 },
            { firstName: "Demir", lastName: "At",organization:"Güçlü Elektrik",email:"onur.at@example.com",phone:"0506-345-6789	",addedBy:2,packageId:2 },

            { firstName: "Serkan", lastName: "Koyuncu",organization:"Net Yazılım",email:"serkan.koyuncu@example.com            ",phone:"0506-111-2222",addedBy:3,packageId:2 },
            { firstName: "Baran", lastName: "Kurt",organization:"Gelişim İnşaat",email:"baran.kurt@example.com",phone:"0506-333-4444",addedBy:3,packageId:1},
            { firstName: "Oğuz", lastName: "Tekin",organization:"Asil Yatırım",email:"oguz.tekin@example.com",phone:"0506-666-7777",addedBy:3,packageId:3},
            { firstName: "İlker", lastName: "Demirtaş",organization:"Nova Bilgisayar",email:"ilker.demirtas@example.com",phone:"0532-888-7777",addedBy:3,packageId:1},
        ]);
    }
};

module.exports = dummyData;
