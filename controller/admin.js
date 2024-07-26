const Users = require("../models/users");
const Customers = require("../models/customers");
const Dealers = require("../models/dealers");
const Purchases = require("../models/purchases");
const Sequelize = require("sequelize");


//müşteri
exports.post_customer_edit = async (req, res) => {
  const id = req.params.id;
  const {firstName,lastName,organization,price,purchaseDate,productName} = req.body;
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
  if (!productName || productName.trim() === '') {
    errors.push({ msg: 'Hizmet boş bırakılamaz' });
  }
  if (!price || isNaN(price) || price < 0 ) {
    errors.push({ msg: "Fiyat 0'dan büyük olmalıdır." });
  }
  if (!purchaseDate) {
    errors.push({ msg: "Tarih boş bırakılamaz" });
  }

  if (errors.length > 0) {
    return res.status(400).render('admin/dealers', {
      title: 'Müşteri Kayıt Formu',
      errors: errors,
      data: { firstName, lastName, organization, price,purchaseDate, productName }
    });
  }
  try{
    const customer = await Customers.findOne({where:{id}});
    customer.firstName = firstName;
    customer.lastName = lastName;
    customer.organization = organization;
    const purchase = await Purchases.findOne({where:{customerId:id}});
    purchase.price = price,
    purchase.purchaseDate = purchaseDate,
    purchase.productName = productName,
    await customer.save();
    await purchase.save();
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
    const purchase = await Purchases.findOne({where:{customerId:id}})
    res.render("admin/customerEdit",{
      title: "Müşteri Düzenle",
      customer:customer,
      purchase:purchase
    });
  }catch(err){
    console.log(err)
  }
}
exports.post_customer_create = async (req, res) => {
  const id = req.params.id
  const {firstName,lastName,organization,price,purchaseDate,productName} = req.body;
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
  if (!productName || productName.trim() === '') {
    errors.push({ msg: 'Hizmet boş bırakılamaz' });
  }
  if (!price || isNaN(price) || price < 0 ) {
    errors.push({ msg: "Fiyat 0'dan büyük olmalıdır." });
  }
  if (!purchaseDate) {
    errors.push({ msg: "Tarih boş bırakılamaz" });
  }

  if (errors.length > 0) {
    
    const dealer = await Dealers.findByPk(id);
    return res.status(400).render(`admin/customerCreate`, {
      title: 'Müşteri Kayıt Formu',
      errors: errors,
      dealer:dealer,
      data: { firstName, lastName, organization, price ,purchaseDate,productName}
    });
  }
  try{
    const customer = await Customers.create({
      firstName:firstName,
      lastName:lastName,
      organization:organization,
      addedBy: id,
    })
    const purchase = await Purchases.create({
      productName:productName,
      price:price,
      purchaseDate:purchaseDate,
      customerId:customer.id
    })
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
    const dealers = await Dealers.findByPk(userId, {
      include: [{
        as: "reference",
        model: Dealers,
        attributes: ["firstName"]
      }]
    });

    const customers = await Customers.findAll({
      where: { addedBy: userId },
      include: [{
        model: Dealers,
        attributes: ["firstName", "dealerCommission", "subDealerCommission"]
      }]
    });

    let filteredCustomers = [];
    if (parsedStartDate && parsedEndDate) {
      filteredCustomers = await Promise.all(customers.map(async (customer) => {
        const purchases = await Purchases.findAll({
          where: {
            customerId: customer.id,
            purchaseDate: {
              [Sequelize.Op.between]: [parsedStartDate, parsedEndDate]
            }
          }
        });
        return { ...customer.toJSON(), purchases };
      }));
    } else {
      filteredCustomers = await Promise.all(customers.map(async (customer) => {
        const purchases = await Purchases.findAll({
          where: { customerId: customer.id }
        });
        return { ...customer.toJSON(), purchases };
      }));
    }

    const customerCount = filteredCustomers.length;

    const subDealers = await Dealers.findAll({
      where: { referenceBy: userId },
      include: [{
        as: "reference",
        model: Dealers,
        attributes: ["firstName", "dealerCommission", "subDealerCommission"]
      }]
    });

    let filteredSubCustomers = [];
    if (parsedStartDate && parsedEndDate) {
      for (const subDealer of subDealers) {
        const subCustomers = await Customers.findAll({
          where: { addedBy: subDealer.id },
          include: [{
            model: Dealers
          }]
        });

        const subFilteredCustomers = await Promise.all(subCustomers.map(async (subCustomer) => {
          const purchases = await Purchases.findAll({
            where: {
              customerId: subCustomer.id,
              purchaseDate: {
                [Sequelize.Op.between]: [parsedStartDate, parsedEndDate]
              }
            }
          });
          return { ...subCustomer.toJSON(), purchases };
        }));

        filteredSubCustomers = filteredSubCustomers.concat(subFilteredCustomers);
      }
    } else {
      for (const subDealer of subDealers) {
        const subCustomers = await Customers.findAll({
          where: { addedBy: subDealer.id },
          include: [{
            model: Dealers
          }]
        });

        const subCustomersWithPurchases = await Promise.all(subCustomers.map(async (subCustomer) => {
          const purchases = await Purchases.findAll({
            where: { customerId: subCustomer.id }
          });
          return { ...subCustomer.toJSON(), purchases };
        }));

        filteredSubCustomers = filteredSubCustomers.concat(subCustomersWithPurchases);
      }
    }

    const totalCommission = filteredCustomers.reduce((total, customer) => {
      const customerTotal = customer.purchases.reduce((sum, purchase) => {
        return sum + (purchase.price * dealers.dealerCommission);
      }, 0);
      return total + customerTotal;
    }, 0);
   
    const totalSubCommission = filteredSubCustomers.reduce((total, subCustomer) => {
      const subCustomerTotal = subCustomer.purchases.reduce((sum, purchase) => {
        return sum + (purchase.price * dealers.subDealerCommission);
      }, 0);
      return total + subCustomerTotal;
    }, 0);
    console.log(dealers.subDealerCommission)

    const totalEarn = parseFloat(totalCommission) + parseFloat(totalSubCommission);
    res.render("admin/userDetails", {
      title: `${dealers.firstName} || Bayi Detay`,
      customers: filteredCustomers,
      customerCount: customerCount,
      subCustomers: filteredSubCustomers,
      dealers: dealers,
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
