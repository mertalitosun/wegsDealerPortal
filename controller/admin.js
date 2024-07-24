const Users = require("../models/users");
const Customers = require("../models/customers");
const Dealers = require("../models/dealers");
const Sequelize = require("sequelize");

//müşteri
exports.post_customer_edit = async (req, res) => {
  const id = req.params.id;
  const {price} = req.body;

  try{
    const customer = await Customers.findOne({where:{id}});
    customer.price = price,
    await customer.save();
    const dealerId = customer.addedBy
    res.redirect(`/admin/dealer/details/${dealerId}`);
  }catch(err){
    console.log(err)
  }
};
exports.get_customer_edit = async(req,res)=>{
  const id = req.params.id;
  try{
    const customer = await Customers.findOne({where:{id}});

    res.render("admin/customerEdit",{
      title: "Müşteri Düzenle",
      customer:customer,
    });
  }catch(err){
    console.log(err)
  }
}
exports.post_customer_create = async (req, res) => {
  const id = req.params.id
  const {firstName,lastName,organization,price} = req.body;
  try{
    const customer = Customers.create({
      firstName:firstName,
      lastName:lastName,
      organization:organization,
      price:price,
      addedBy: id,
    })
  }catch(err){
    console.log(err)
  }
  res.redirect(`/admin/dealer/details/${id}`);
};
exports.get_customer_create = async (req, res) => {
  try{
    const customers = await Customers.findAll();
    res.render("admin/customerCreate", {
      title: "Müşteri Ekle",
      customers:customers
    });
  }catch(err){
    console.log(err)
  }
};

//Bayi
exports.post_dealer_edit = async (req, res) => {
  const id = req.params.id;
  const {firstName,lastName,dealerCommission,subDealerCommission} = req.body;

  try{
    const dealers = await Dealers.findOne({where:{id}});
    dealers.firstName = firstName,
    dealers.lastName = lastName,
    dealers.dealerCommission = dealerCommission,
    dealers.subDealerCommission = subDealerCommission,
    await dealers.save();
    res.redirect(`/admin/dealer/details/${id}`);
  }catch(err){
    console.log(err)
  }
};
exports.get_dealer_edit = async (req, res) => {
  const id = req.params.id;
  try{
    const dealers = await Dealers.findOne({where:{id}});

    res.render("admin/dealerEdit",{
      title: "Bayi Düzenle",
      dealers:dealers,
    });
  }catch(err){
    console.log(err)
  }
};
exports.post_dealer_delete = async (req, res) => {
  const id = req.params.id;
  try{
    await Dealers.destroy({ where: {id} });
    res.redirect("/admin/dealers");
  }catch(err){
    console.log(err)
  }
};
exports.get_dealer_delete = async (req, res) => {
  const id = req.params.id;
  try{
    const dealers = await Dealers.findOne({where:{id}});

    res.render("admin/dealerDelete",{
      title: "Bayi Sil",
      dealers:dealers,
    });
  }catch(err){
    console.log(err)
  }
};

//Bayi Kayıt - Admin
exports.post_admin_dealer_create = async(req,res) =>{
  const id = req.params.id;
  const {firstName,lastName,dealerCommission,subDealerCommission} = req.body;
  try{
    const dealers = await Dealers.create({
      firstName:firstName,
      lastName:lastName,
      dealerCommission:dealerCommission,
      subDealerCommission:subDealerCommission,
    });
    res.redirect("/admin/dealers");
  }catch(err){
    console.log(err);
  }
}

//Bayi Kayıt - Dealer
exports.post_dealer_create = async(req,res) =>{
  const id = req.params.id;
  const {firstName,lastName,dealerCommission,subDealerCommission} = req.body;
  try{
    const dealers = await Dealers.create({
      firstName:firstName,
      lastName:lastName,
      dealerCommission:dealerCommission,
      subDealerCommission:subDealerCommission,
      referenceBy:id
    });
    res.redirect("/admin/dealers");
  }catch(err){
    console.log(err);
  }
}
//Bayi Kayıt - Dealer
exports.get_dealer_create = async(req,res) =>{
  res.render("admin/dealerCreate",{
    title:"Bayi Kayıt Formu"
  })
}

//Bayi - Alt Bayi Müşterileri
exports.get_dealer_subCustomers = async (req, res) => {
  const id = req.params.id;
  const { startDate, endDate } = req.query;

  // Parse dates
  const parsedStartDate = startDate ? new Date(startDate) : null;
  const parsedEndDate = endDate ? new Date(endDate) : null;

  try {
    const dealers = await Dealers.findByPk(id, {
      include: [{
        as: "reference",
        model: Dealers,
        attributes: ["firstName"]
      }]
    });

    const customers = await Customers.findAll({
      where: {
        addedBy: id
      },
      include: [{
        model: Dealers,
        attributes: ["firstName", "dealerCommission", "subDealerCommission"]
      }]
    });

    const customerCount = customers.length;

    const subDealers = await Dealers.findAll({
      where: { referenceBy: id },
      include: [{
        as: "reference",
        model: Dealers,
        attributes: ["firstName", "dealerCommission", "subDealerCommission"]
      }]
    });

    let subCustomers = [];

    if (subDealers.length > 0) {
      for (const subDealer of subDealers) {
        const whereConditions = { addedBy: subDealer.id };
        if (parsedStartDate && parsedEndDate) {
          const endDateWithTime = new Date(parsedEndDate);
          endDateWithTime.setDate(endDateWithTime.getDate() + 1);
          whereConditions.createdAt = {
            [Sequelize.Op.between]: [parsedStartDate, endDateWithTime]
          };
        }

        const customersForSubDealer = await Customers.findAll({
          where: whereConditions,
          include: [{
            model: Dealers,
          }]
        });
        subCustomers = subCustomers.concat(customersForSubDealer);
      }
    }

    const totalSubCommission = subCustomers.reduce((total, subCustomer) => {
      return total + (subCustomer.price * dealers.subDealerCommission);
    }, 0);

    res.render("admin/subCustomers", {
      title: `${dealers.firstName} || Bayi Detay || Alt Bayi Müşterileri`,
      subCustomers: subCustomers,
      customerCount: customerCount,
      dealers: dealers,
      subDealers: subDealers,
      subDealerCommission: dealers.subDealerCommission,
      totalSubCommission: totalSubCommission.toFixed(2)
    });
  } catch (err) {
    console.log(err);
  }
};

//Bayi Müşterileri
exports.get_dealer_details = async (req, res) => {
  const userId = req.params.id;
  const { startDate, endDate } = req.query;

  const parsedStartDate = startDate ? new Date(startDate) : null;
  const parsedEndDate = endDate ? new Date(endDate) : null;

  try {
    const dealers = await Dealers.findByPk(userId, {
      include: [{
        as: "reference",
        model: Dealers,
        attributes: ["firstName"]
      }]
    });

    const whereConditions = { addedBy: userId };
    if (parsedStartDate && parsedEndDate) {
      whereConditions.createdAt = {
        [Sequelize.Op.between]: [parsedStartDate, parsedEndDate]
      };
    }

    const customers = await Customers.findAll({
      where: whereConditions,
      include: [{
        model: Dealers,
        attributes: ["firstName", "dealerCommission", "subDealerCommission"]
      }]
    });

    const customerCount = customers.length;

    const subDealers = await Dealers.findAll({
      where: { referenceBy: userId },
      include: [{
        as: "reference",
        model: Dealers,
        attributes: ["firstName", "dealerCommission", "subDealerCommission"]
      }]
    });

    let subCustomers = [];

    if (subDealers.length > 0) {
      for (const subDealer of subDealers) {
        const customersForSubDealer = await Customers.findAll({
          where: { addedBy: subDealer.id },
          include: [{
            model: Dealers,
          }]
        });
        subCustomers = subCustomers.concat(customersForSubDealer);
      }
    }

    const totalCommission = customers.reduce((total, customer) => {
      return total + (customer.price * dealers.dealerCommission);
    }, 0);

    res.render("admin/userDetails", {
      title: `${dealers.firstName} || Bayi Detay`,
      customers: customers,
      customerCount: customerCount,
      subCustomers: subCustomers,
      dealers: dealers,
      totalCommission: totalCommission.toFixed(2),
    });

  } catch (err) {
    console.log(err);
  }
};


exports.get_dealers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 

    const { count, rows: dealers } = await Dealers.findAndCountAll({
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

  
    res.render("admin/dealers", {
      title: "Bayiler",
      dealers: dealers,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (err) {
    console.log(err);
  }
};


exports.get_profile = async (req, res) => {
  const userId = req.session.userId;
  try{
    const user = await Users.findByPk(userId);
    res.render("admin/profile", {
      title: user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1),
      user:user
    });
  }catch(err){
    console.log(err)
  }
};

exports.get_index = async (req, res) => {
 res.render("admin/admin",{
  title:"Anasayfa"
 })
};
