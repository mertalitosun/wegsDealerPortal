const Users = require("../models/users");
const bcrypt = require("bcrypt");

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
    const{firstName,lastName,email,password} = req.body;
    
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

        const user = await Users.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
        });

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