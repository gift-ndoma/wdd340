// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory by detail view  
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

// management page - available at /inv/
router.get("/", utilities.handleErrors(invController.buildManagement))

// display add classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// process the classification add (POST)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.registerClassification)
)

// GET add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// POST add inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.registerInventory)
)

module.exports = router

