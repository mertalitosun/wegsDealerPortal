const Users = require("../models/users");
const Roles = require("../models/roles");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

exports.get_register = async (req, res) => {
    try {
        return res.render("auth/register", {
            title: "Bayi Kayıt Sayfası"
        });
    } catch (err) {
        console.log(err);
    }
};

exports.post_register = async (req, res) => {
    const{firstName,lastName,email,reference_by,password} = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const existingUsers = await Users.findOne({
            where: {
                email: email
            }
        });
        if (existingUsers) {
            return res.render("auth/register", {
                title: "Bayi Kayıt Sayfası",
                message: "Bu e-posta adresi zaten kullanılıyor."
            });
        }
        const uniqueCode = shortid.generate();
        const reference_code = uniqueCode

        let userRoleName = 'Bayi';
        const users = await Users.findAll();
        if (!users.length) {
            userRoleName = 'Admin';
        } else if (reference_by) {
            userRoleName = 'Alt Bayi';
        }
        let userRole = await Roles.findOne({ where: { roleName: userRoleName } });
        if (!userRole) {
            userRole = await Roles.create({ roleName: userRoleName });
        }
        const user = await Users.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            referenceBy : reference_by ? reference_by : null ,
            referenceCode:reference_code
        });

        if(userRole){
            await user.addRole(userRole);
        }
        return res.redirect("/login");
    } catch (err) {
        console.log(err);
    }
};

exports.get_login = async (req, res) => {
    try {
        return res.render("auth/login", {
            title: "Bayi Giriş Sayfası"
        });
    } catch (err) {
        console.log(err);
    }
};

exports.post_login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await Users.findOne({
            where: {
                email: email
            },include:{
                model:Roles
            }
        });
        if (!user) {
            return res.render("auth/login", {
                title: "Bayi Giriş Yap Sayfası",
                message: "Kullanıcı Bulunamadı"
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.isAuth = true;
            req.session.userId = user.id;
            req.session.fullName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) + " " + user.lastName.charAt(0).toUpperCase()+ user.lastName.slice(1)
            req.session.roles = user.roles.map(role => role.roleName);
            if(req.session.roles.includes("Admin")){
                req.session.isAdmin = true;
                req.session.isDealer = true;
            }
            if(req.session.roles.includes("Bayi") || req.session.roles.includes("Alt Bayi") ){
                req.session.isAdmin = false;
                req.session.isDealer = true;
            }
            res.redirect("/profile");
        } else {
            res.render("auth/login", {
                title: "Bayi Giriş Yap Sayfası",
                message: "Hatalı Parola"
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.get_logout = async (req, res) => {
    await req.session.destroy();
    return res.redirect("/")
};