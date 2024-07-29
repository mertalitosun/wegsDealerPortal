const Users = require("../models/users");
const Customers = require("../models/customers");
const Dealers = require("../models/dealers");
const Purchases = require("../models/purchases");
const Sequelize = require("sequelize");
const shortid = require("shortid");


const firstLetter = (data) =>{
  return data.charAt(0).toUpperCase() + data.slice(1);
}
exports.post_add_order = async(req,res)=>{
  const customerCode = req.params.customerCode;
  const{productName,price,purchaseDate} = req.body;

  try{
    const customer = await Customers.findOne({where:{customerCode:customerCode},include:[{
      model:Dealers,
      attributes:["dealerCode"]
    }]})
    const purchase = await Purchases.create({
      purchaseCode : `PRC-${shortid.generate()}`,
      productName:firstLetter(productName),
      price:price,
      purchaseDate:purchaseDate,
      customerId:customer.id
    })
    res.redirect(`/admin/dealer/details/${customer.dealer.dealerCode}`);
  }catch(err){
    console.log(err)
  }
}

exports.get_add_order = async(req,res)=>{
  const customerCode = req.params.customerCode;
  try{
    const customer = await Customers.findOne({where:{customerCode:customerCode},include:[{
      model:Dealers,
      attributes:["id"]
    }]});
    res.render("admin/addOrder",{
      title: `${customer.firstName}|| Sipariş Ekle`,
      customer:customer
    })
  }catch(err){
    console.log(err)
  }
}
//müşteri
exports.post_customer_edit = async (req, res) => {
  const customerCode = req.params.customerCode;
  const purchaseCode = req.params.purchaseCode;
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
    const customer = await Customers.findOne({where:{customerCode:customerCode}});
    customer.firstName = firstLetter(firstName);
    customer.lastName = firstLetter(lastName);
    customer.organization = firstLetter(organization);
    const purchase = await Purchases.findOne({where:{purchaseCode:purchaseCode}});
    purchase.price = price,
    purchase.purchaseDate = purchaseDate,
    purchase.productName = firstLetter(productName),
    await customer.save();
    await purchase.save();
    const dealer = await Dealers.findOne({where:{id:customer.addedBy}})
    res.redirect(`/admin/dealer/details/${dealer.dealerCode}`);
  }catch(err){
    console.log(err)
  }
};
exports.get_customer_edit = async(req,res)=>{
  const customerCode = req.params.customerCode;
  const purchaseCode = req.params.purchaseCode
  try{
    const customer = await Customers.findOne({where:{customerCode:customerCode},include:[{
      model:Dealers,
      attributes:["id"]
    }]});
    const purchase = await Purchases.findOne({where:{purchaseCode:purchaseCode}})
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
  const dealerCode = req.params.dealerCode
  const {firstName,lastName,organization,price,purchaseDate,productName} = req.body;
  const dealer = await Dealers.findOne({where:{dealerCode:dealerCode}});
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
    
   
    return res.status(400).render(`admin/customerCreate`, {
      title: 'Müşteri Kayıt Formu',
      errors: errors,
      dealer:dealer,
      data: { firstName, lastName, organization, price ,purchaseDate,productName}
    });
  }
  try{
    const customer = await Customers.create({
      customerCode : `CSR-${shortid.generate()}`,
      firstName:firstLetter(firstName),
      lastName:firstLetter(lastName),
      organization:firstLetter(organization),
      addedBy: dealer.id
    })
    const purchase = await Purchases.create({
      purchaseCode : `PRC-${shortid.generate()}`,
      productName:productName,
      price:price,
      purchaseDate:purchaseDate,
      customerId:customer.id
    })
  }catch(err){
    console.log(err)
  }
  res.redirect(`/admin/dealer/details/${dealerCode}`);
};
exports.get_customer_create = async (req, res) => {
  const dealerCode = req.params.dealerCode;
  try{
    const dealer = await Dealers.findOne({where:{dealerCode:dealerCode}});
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
  const dealerCode = req.params.dealerCode;
  const {firstName,lastName,dealerCommission,subDealerCommission,status,statusDescription} = req.body;
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
    return res.status(400).render('admin/dealerEdit', {
      title: 'Bayi Kayıt Formu',
      errors: errors,
      data: { firstName, lastName, dealerCommission, subDealerCommission, status }
    });
  }
  try{
    const dealers = await Dealers.findOne({where:{dealerCode:dealerCode}});
    dealers.firstName = firstLetter(firstName);
    dealers.lastName = firstLetter(lastName);
    dealers.dealerCommission = (parseFloat(dealerCommission) / 100).toFixed(2);
    dealers.subDealerCommission = (parseFloat(subDealerCommission) / 100).toFixed(2);
    dealers.status = status;
    dealers.statusDescription = status == "true" ? null : statusDescription;
    await dealers.save();
    res.redirect(`/admin/dealer/details/${dealerCode}`);
  }catch(err){
    console.log(err)
  }
};
exports.get_dealer_edit = async (req, res) => {
  const dealerCode = req.params.dealerCode;
  try{
    const dealers = await Dealers.findOne({where:{dealerCode:dealerCode}});

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
      dealerCode : `DLR-${shortid.generate()}`,
      firstName:firstLetter(firstName),
      lastName:firstLetter(lastName),
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
  const dealerCode = req.params.dealerCode;
  const {firstName,lastName,dealerCommission,subDealerCommission} = req.body;
  const dealer = await Dealers.findOne({where:{dealerCode:dealerCode}})
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
      dealerCode : `DLR-${shortid.generate()}`,
      firstName:firstLetter(firstName),
      lastName:firstLetter(lastName),
      dealerCommission: (parseFloat(dealerCommission) / 100).toFixed(2),
      subDealerCommission: (parseFloat(subDealerCommission) / 100).toFixed(2),
      referenceBy:dealer.id
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
  const dealerCode = req.params.dealerCode;
  const { startDate, endDate } = req.query;

  const parsedStartDate = startDate ? new Date(startDate) : null;
  const parsedEndDate = endDate ? new Date(endDate) : null;

  try {
    const dealers = await Dealers.findOne({
      where: { dealerCode: dealerCode },
      include: [{
        as: "reference", 
        model: Dealers,
        attributes: ["firstName"]
      }]
    });

    const customers = await Customers.findAll({
      where: { addedBy: dealers.id },
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
      where: { referenceBy: dealers.id },
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
      title: firstLetter(user.firstName),
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
