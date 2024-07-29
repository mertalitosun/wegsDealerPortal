module.exports=function(req,res,next){
    res.locals.isAuth=req.session.isAuth;
    res.locals.fullName = req.session.fullName;
    res.locals.userId = req.session.userId;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.isModerator = req.session.isModerator
    next();
}