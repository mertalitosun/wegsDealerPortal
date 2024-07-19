const Roles = require("../models/roles");
const Users = require("../models/users");
const Customers = require("../models/customers");
const Packages = require("../models/packages");



exports.post_package_edit = async (req, res) => {
  const packageId = req.params.id;
  const {packageName, packagePrice} = req.body;

  try{
    const packages = await Packages.findOne({where:{id:packageId}});
    packages.packageName = packageName;
    packages.packagePrice = packagePrice;
    await packages.save();
    res.redirect("/admin/packages");
  }catch(err){
    console.log(err)
  }
};
exports.get_package_edit = async (req, res) => {
  const packageId = req.params.id;
  try{
    const packages = await Packages.findOne({where:{id:packageId}});

    res.render("admin/packages/packageEdit",{
      title: "Paket Düzenle",
      packages:packages,
    });
  }catch(err){
    console.log(err)
  }
};
exports.post_package_delete = async (req, res) => {
  const packageId = req.params.id;
  try{
    await Packages.destroy({ where: { id: packageId } });
    res.redirect("/admin/packages");
    
  }catch(err){
    console.log(err)
  }
};
exports.get_package_delete = async (req, res) => {
  const packageId = req.params.id;
  try{
    const packages = await Packages.findOne({where:{id:packageId}});

    res.render("admin/packages/packageDelete",{
      title: "Paket Sil",
      packages:packages,
    });
  }catch(err){
    console.log(err)
  }
};
exports.post_package_create = async (req, res) => {
  const {packageName, packagePrice} = req.body;
  try{
    await Packages.create({
      packageName:packageName,
      packagePrice:packagePrice
    })
    res.redirect("/admin/packages");
  }catch(err){
    console.log(err)
  }
};
exports.get_package_create = async(req,res)=>{
  res.render("admin/packages/packageCreate", {
    title: "Paket Ekle",
  });
}
exports.get_packages = async(req,res)=>{
  try{
    const packages = await Packages.findAll();
    res.render("admin/packages/packages",{
      title:"Paket Fiyatlar",
      packages:packages
    })
  }catch(err){
    console.log(err)
  }
}
//Bayi
exports.get_user_details = async (req, res) => {
  const userId = req.params.id
  try{
    const customers = await Customers.findAll({where:{
      addedBy:userId
    },
    include:[
      {
        model:Users,
        attributes:["firstName","referenceCode"]
      },
      {
        model:Packages,
        attributes:["packageName","packagePrice"]
      }
    ]});
    const customerCount = customers.length
    const users = await Users.findByPk(userId, {include:[{model:Roles},
      {model:Users,
        as:"reference",
        attributes:["id","firstName","lastName"]
      }
    ]})
    res.render("admin/userDetails",{
      title: "Bayi Detay",
      customers:customers,
      users:users,
      customerCount:customerCount
    });
  }catch(err){
    console.log(err)
  }
};
exports.get_dealers = async (req, res) => {
  try{
    const users = await Users.findAll({include:Roles});
    res.render("admin/dealers",{
      title: "Bayiler",
      users:users,
    });
  }catch(err){
    console.log(err)
  }
};
//Roles
exports.post_role_edit = async (req, res) => {
  const roleId = req.params.id;
  const roleName = req.body.roleName;
  try{
    const roles = await Roles.findOne({where:{id:roleId}});
    roles.roleName = roleName;
    await roles.save();
    res.redirect("/admin/roles");
  }catch(err){
    console.log(err)
  }
};
exports.get_role_edit = async (req, res) => {
  const roleId = req.params.id;
  try{
    const roles = await Roles.findOne({where:{id:roleId}});

    res.render("admin/roles/roleEdit",{
      title: "Rol Düzenle",
      role:roles,
    });
  }catch(err){
    console.log(err)
  }
};
exports.post_role_delete = async (req, res) => {
  const roleId = req.params.id;
  try{
    await Roles.destroy({ where: { id: roleId } });
    res.redirect("/admin/roles");
    
  }catch(err){
    console.log(err)
  }
};
exports.get_role_delete = async (req, res) => {
  const roleId = req.params.id;
  try{
    const roles = await Roles.findOne({where:{id:roleId}});

    res.render("admin/roles/roleDelete",{
      title: "Rol Sil",
      role:roles,
    });
  }catch(err){
    console.log(err)
  }
};
exports.post_role_create = async (req, res) => {
  const roleName = req.body.roleName;
  try{
    await Roles.create({
      roleName:roleName
    })
    res.redirect("/admin/roles");
  }catch(err){
    console.log(err)
  }
};
exports.get_role_create = async (req, res) => {
  try{
    res.render("admin/roles/roleCreate", {
      title: "Rol Ekle",
    });
  }catch(err){
    console.log(err)
  }
};
exports.get_roles = async (req, res) => {
  try{
    const roles = await Roles.findAll();
    res.render("admin/roles/roles", {
      title: "Roller",
      roles: roles
    });
  }catch(err){
    console.log(err)
  }
};

exports.get_profile = async (req, res) => {
  const userId = req.session.userId;
  try{
    const user = await Users.findByPk(userId,{include:{
      model:Roles
    }});
    res.render("users/profile", {
      title: user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) + " || " +  user.roles.map(role => role.roleName),
      user:user
    });
  }catch(err){
    console.log(err)
  }
};
