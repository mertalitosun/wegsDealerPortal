const Customers = require("../models/customers");
const Packages = require("../models/packages");




exports.post_customer_create = async (req, res) => {
  const {firstName,lastName,organization,phone,email,package} = req.body;
  try{
    const customer = Customers.create({
      firstName:firstName,
      lastName:lastName,
      organization:organization,
      phone:phone,
      email:email,
      addedBy: req.session.userId,
      packageId:package
    })
  }catch(err){
    console.log(err)
  }
  res.redirect("/user/customers");
};

exports.get_customer_create = async (req, res) => {
  try{
    const packages = await Packages.findAll();
    res.render("users/customerCreate", {
      title: "Müşteri Ekle",
      packages:packages
    });
  }catch(err){
    console.log(err)
  }
};

exports.get_customers = async (req, res) => {
  const userId = req.session.userId
  try {
    const customers = await Customers.findAll({where:{addedBy:userId},include:[{model:Packages,attributes:["packageName","packagePrice"]}]});
    res.render("users/customers", {
      title: "Müşteriler",
      customers: customers,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.get_index = async (req, res) => {
  res.render("users/index", {
    title: "Anasayfa",
  });
};
