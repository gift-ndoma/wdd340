// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)


// Process the login attempt with server-side validation
router.post(
  "/login",
  regValidate.loginRules(), 
  regValidate.checkLoginData, 
  utilities.handleErrors(accountController.accountLogin)
)

// Default account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Route to deliver account update view
router.get("/update/:account_id", 
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// Route to process account information update
router.post("/update",
  regValidate.updateAccountRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Route to process password change
router.post("/change-password",
  regValidate.changePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
)

// Route to handle logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))


module.exports = router