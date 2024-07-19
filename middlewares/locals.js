module.exports=function(req,res,next){
    res.locals.isAuth=req.session.isAuth;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.isDealer = req.session.isDealer;
    res.locals.fullName = req.session.fullName;
    next();
}