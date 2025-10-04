// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")
const jwtCheck = require("../utilities/jwt-check")

// Route to build inventory by classification view (PUBLIC - no auth needed)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory by detail view (PUBLIC - no auth needed)
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

// Route to build management view (RESTRICTED - requires Employee or Admin)
router.get("/", 
  jwtCheck.checkAccountType,
  utilities.handleErrors(invController.buildManagement))

// Route to build add classification view (RESTRICTED)
router.get("/add-classification", 
  jwtCheck.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification (RESTRICTED)
router.post("/add-classification", 
  jwtCheck.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification))

// Route to build add inventory view (RESTRICTED)
router.get("/add-inventory", 
  jwtCheck.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory))

// Route to process add inventory (RESTRICTED)
router.post("/add-inventory", 
  jwtCheck.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory))

// Route to get inventory by classification_id as JSON (RESTRICTED)
router.get("/getInventory/:classification_id", 
  jwtCheck.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON))

// Route to build inventory edit view (RESTRICTED)
router.get("/edit/:inv_id", 
  jwtCheck.checkAccountType,
  utilities.handleErrors(invController.editInventoryView))

// Route to handle inventory update (RESTRICTED)
router.post("/update/",
  jwtCheck.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory))

// Route to build delete confirmation view (RESTRICTED)
router.get("/delete/:inv_id", 
  jwtCheck.checkAccountType,
  utilities.handleErrors(invController.buildDeleteConfirmation))

// Route to process the deletion (RESTRICTED)
router.post("/delete/",
  jwtCheck.checkAccountType,
  utilities.handleErrors(invController.deleteInventory))

module.exports = router