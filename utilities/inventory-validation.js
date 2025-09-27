const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* classification validation rules */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .matches(/^[A-Za-z0-9_-]+$/) // NO spaces or special characters. adapt the regex as required
      .withMessage("Classification is required and cannot contain spaces or special characters.")
  ]
}

/* check classification data */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name
    })
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a classification."),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required."),
    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Valid year is required."),
    body("inv_price")
      .trim()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Valid price is required."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required."),
    // images optional but sanitize
    body("inv_image").trim().escape(),
    body("inv_thumbnail").trim().escape()
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_description,
    inv_image,
    inv_thumbnail
  } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // build classification select (sticky)
    let classificationList = await utilities.buildClassificationList(classification_id)
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_description,
      inv_image,
      inv_thumbnail
    })
  }
  next()
}

module.exports = validate
