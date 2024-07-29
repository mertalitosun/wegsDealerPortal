const isAdmin = (req, res, next) => {
    if (!req.session.isAdmin) {
      return res.redirect("/profile");
    }
    next();
  };
  
  const isModerator = (req, res, next) => {
    if (!req.session.isDealer) {
      return res.redirect("/profile");
    }
    next();
  };
  
  module.exports = {isAdmin,isModerator}