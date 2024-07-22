const Customers = require("../models/customers");
const Users = require("../models/users");
const Roles = require("../models/roles");
const Packages = require("../models/packages");
const CommissionRates = require("../models/commissionRates");




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
    
    const customers = await Customers.findAll({where:{addedBy:userId},include:[{model:Packages,attributes:["packageName","packagePrice"]},
    {
      model:Users,
      attributes:["firstName","referenceCode"],
      include:{model:Roles}
    }]});

    const users = await Users.findByPk(userId, {include:[{model:Roles},
      {model:Users,
        as:"reference",
        attributes:["id","firstName","lastName"]
      },
    ]})
    const subDealers = await Users.findAll({where:{referenceBy:users.referenceCode},include:{model:Roles}})
    let subCustomers = [];

    if (subDealers.length > 0) {
      for (const subDealer of subDealers) {
        const customersForSubDealer = await Customers.findAll({
          where: { addedBy: subDealer.id },
          include: [
            {
              model: Users,
              attributes: ["firstName", "referenceCode"]
            },
            {
              model: Packages,
              attributes: ["packageName", "packagePrice"]
            }
          ]
        });
        subCustomers = subCustomers.concat(customersForSubDealer);
      }
    }
    let commissionRate = await CommissionRates.findAll({where:{name:"Bayi Müşterisi"}});
    let subDealerCommissionRate = await CommissionRates.findAll({where:{name:"Alt Bayi Müşterisi"}});
    commissionRate = commissionRate[0].dataValues.rate
    subDealerCommissionRate = subDealerCommissionRate[0].dataValues.rate
    res.render("users/customers", {
      title: "Müşteriler",
      customers: customers,
      subCustomers,subCustomers,
      subDealers:subDealers,
      commissionRate:commissionRate,
      subDealerCommissionRate:subDealerCommissionRate
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
