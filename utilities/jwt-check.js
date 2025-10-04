const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
* Check Login - Middleware to check if user is logged in
* Makes account data available in res.locals for all views
**************************************** */
function checkJWTToken(req, res, next) {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    res.locals.loggedin = 0
    next()
  }
}


/* ****************************************
* Check account type - Middleware to check if user is Employee or Admin
* Restricts access to inventory management
**************************************** */
function checkAccountType(req, res, next) {
  if (res.locals.loggedin && (res.locals.accountData.account_type === 'Employee' || res.locals.accountData.account_type === 'Admin')) {
    next()
  } else {
    req.flash("notice", "You must be logged in as an employee or administrator to access this resource.")
    return res.redirect("/account/login")
  }
}

module.exports = { checkJWTToken, checkAccountType }