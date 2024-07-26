const Users = require("../models/users");
const Customers = require("../models/customers");
const Dealers = require("../models/dealers");
const Sequelize = require("sequelize");


//müşteri
exports.post_customer_edit = async (req, res) => {
  const id = req.params.id;
  const {firstName,lastName,organization,price,agreementDate} = req.body;
  const errors = [];

  if (!firstName || firstName.trim() === '') {
    errors.push({ msg: 'Ad boş bırakılamaz' });
  }
  if (!lastName || lastName.trim() === '') {
    errors.push({ msg: 'Soyad boş bırakılamaz' });
  }
  if (!organization || organization.trim() === '') {
    errors.push({ msg: 'Organizasyon boş bırakılamaz' });
  }
  if (!price || isNaN(price) || price < 0 ) {
    errors.push({ msg: "Fiyat 0'dan büyük olmalıdır." });
  }
  if (!agreementDate || isNaN(agreementDate)) {
    errors.push({ msg: "Tarih boş bırakılamaz" });
  }

  if (errors.length > 0) {
    return res.status(400).render('admin/dealerCreate', {
      title: 'Müşteri Kayıt Formu',
      errors: errors,
      data: { firstName, lastName, organization, price,agreementDate }
    });
  }
  try{
    const customer = await Customers.findOne({where:{id}});
    customer.firstName = firstName,
    customer.lastName = lastName,
    customer.organization = organization,
    customer.price = price,
    customer.agreementDate = agreementDate,
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
    const customer = await Customers.findOne({where:{id},include:[{
      model:Dealers,
      attributes:["id"]
    }]});

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
  const {firstName,lastName,organization,price,agreementDate} = req.body;
  const errors = [];
  if (!firstName || firstName.trim() === '') {
    errors.push({ msg: 'Ad boş bırakılamaz' });
  }
  if (!lastName || lastName.trim() === '') {
    errors.push({ msg: 'Soyad boş bırakılamaz' });
  }
  if (!organization || organization.trim() === '') {
    errors.push({ msg: 'Organizasyon boş bırakılamaz' });
  }
  if (!price || isNaN(price) || price < 0 ) {
    errors.push({ msg: "Fiyat 0'dan büyük olmalıdır." });
  }
  if (!agreementDate) {
    errors.push({ msg: "Tarih boş bırakılamaz" });
  }
  const dealer = await Dealers.findByPk(id);

  if (errors.length > 0) {
    return res.status(400).render(`admin/customerCreate`, {
      title: 'Müşteri Kayıt Formu',
      errors: errors,
      dealer:dealer,
      data: { firstName, lastName, organization, price ,agreementDate}
    });
  }
  try{
    const customer = await Customers.create({
      firstName:firstName,
      lastName:lastName,
      organization:organization,
      price:price,
      agreementDate:agreementDate,
      addedBy: id,
    });
    dealer.status = true;
    dealer.save();
  }catch(err){
    console.log(err)
  }
  res.redirect(`/admin/dealer/details/${id}`);
};
exports.get_customer_create = async (req, res) => {
  const id = req.params.id;
  try{
    const dealer = await Dealers.findByPk(id);
    res.render("admin/customerCreate", {
      title: "Müşteri Ekle",
      dealer:dealer
    });
  }catch(err){
    console.log(err)
  }
    
};

//Bayi
exports.post_dealer_edit = async (req, res) => {
  const id = req.params.id;
  const {firstName,lastName,dealerCommission,subDealerCommission,status} = req.body;
  let errors = [];

  if (!firstName || firstName.trim() === '') {
    errors.push({ msg: 'Ad boş bırakılamaz' });
  }
  if (!lastName || lastName.trim() === '') {
    errors.push({ msg: 'Soyad boş bırakılamaz' });
  }
  if (!dealerCommission || isNaN(dealerCommission) || dealerCommission < 0 || dealerCommission > 100) {
    errors.push({ msg: 'Bayi Komisyonu 0 ile 100 arasında olmalıdır' });
  }
  if (!subDealerCommission || isNaN(subDealerCommission) || subDealerCommission < 0 || subDealerCommission > 100) {
    errors.push({ msg: 'Alt Bayi Komisyonu 0 ile 100 arasında olmalıdır' });
  }

  if (errors.length > 0) {
    return res.status(400).render('admin/dealerCreate', {
      title: 'Bayi Kayıt Formu',
      errors: errors,
      data: { firstName, lastName, dealerCommission, subDealerCommission, status }
    });
  }
  try{
    const dealers = await Dealers.findOne({where:{id}});
    dealers.firstName = firstName;
    dealers.lastName = lastName;
    dealers.dealerCommission = (parseFloat(dealerCommission) / 100).toFixed(2);
    dealers.subDealerCommission = (parseFloat(subDealerCommission) / 100).toFixed(2);
    dealers.status = status;
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
  let errors = [];

  if (!firstName || firstName.trim() === '') {
    errors.push({ msg: 'Ad boş bırakılamaz' });
  }
  if (!lastName || lastName.trim() === '') {
    errors.push({ msg: 'Soyad boş bırakılamaz' });
  }
  if (!dealerCommission || isNaN(dealerCommission) || dealerCommission < 0 || dealerCommission > 100) {
    errors.push({ msg: 'Bayi Komisyonu 0 ile 100 arasında olmalıdır' });
  }
  if (!subDealerCommission || isNaN(subDealerCommission) || subDealerCommission < 0 || subDealerCommission > 100) {
    errors.push({ msg: 'Alt Bayi Komisyonu 0 ile 100 arasında olmalıdır' });
  }

  if (errors.length > 0) {
    return res.status(400).render('admin/dealerCreate', {
      title: 'Bayi Kayıt Formu',
      errors: errors,
      data: { firstName, lastName, dealerCommission, subDealerCommission }
    });
  }
  try{
    const dealers = await Dealers.create({
      firstName:firstName,
      lastName:lastName,
      dealerCommission: (parseFloat(dealerCommission) / 100).toFixed(2),
      subDealerCommission: (parseFloat(subDealerCommission) / 100).toFixed(2),
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
  let errors = [];

  if (!firstName || firstName.trim() === '') {
    errors.push({ msg: 'Ad boş bırakılamaz' });
  }
  if (!lastName || lastName.trim() === '') {
    errors.push({ msg: 'Soyad boş bırakılamaz' });
  }
  if (!dealerCommission || isNaN(dealerCommission) || dealerCommission < 0 || dealerCommission > 100) {
    errors.push({ msg: 'Bayi Komisyonu 0 ile 100 arasında olmalıdır' });
  }
  if (!subDealerCommission || isNaN(subDealerCommission) || subDealerCommission < 0 || subDealerCommission > 100) {
    errors.push({ msg: 'Alt Bayi Komisyonu 0 ile 100 arasında olmalıdır' });
  }

  if (errors.length > 0) {
    return res.status(400).render('admin/dealerCreate', {
      title: 'Bayi Kayıt Formu',
      errors: errors,
      data: { firstName, lastName, dealerCommission, subDealerCommission }
    });
  }
  try{
    const dealers = await Dealers.create({
      firstName:firstName,
      lastName:lastName,
      dealerCommission: (parseFloat(dealerCommission) / 100).toFixed(2),
      subDealerCommission: (parseFloat(subDealerCommission) / 100).toFixed(2),
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
    title:"Bayi Kayıt Formu",
  });
}


exports.get_dealer_details = async (req, res) => {
  const userId = req.params.id;
  const { startDate, endDate } = req.query;

  const parsedStartDate = startDate ? new Date(startDate) : null;
  const parsedEndDate = endDate ? new Date(endDate) : null;

  try {
    const dealers = await Dealers.findOne({where:{id:userId},
      include: [{
        as: "reference",
        model: Dealers,
        attributes: ["firstName"]
      }]
    });

    const whereConditions = { addedBy: userId };
    if (parsedStartDate && parsedEndDate) {
      whereConditions.agreementDate = {
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
        const subWhereConditions = { addedBy: subDealer.id };
        if (parsedStartDate && parsedEndDate) {
          subWhereConditions.agreementDate = {
            [Sequelize.Op.between]: [parsedStartDate, parsedEndDate]
          };
        }

        const customersForSubDealer = await Customers.findAll({
          where: subWhereConditions,
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

    const totalSubCommission = subCustomers.reduce((total, subCustomer) => {
      return total + (subCustomer.price * dealers.subDealerCommission);
    }, 0);

    const totalEarn = parseFloat(totalCommission) + parseFloat(totalSubCommission);
    res.render("admin/userDetails", {
      title: `${dealers.firstName} || Bayi Detay`,
      customers: customers,
      customerCount: customerCount,
      subCustomers: subCustomers,
      dealers: dealers,
      subDealerCommission: dealers.subDealerCommission,
      totalSubCommission: totalSubCommission.toFixed(2),
      totalCommission: totalCommission.toFixed(2),
      totalEarn: totalEarn.toFixed(2)
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
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
