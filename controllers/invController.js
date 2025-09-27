const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by inventory_id view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const detail = await utilities.buildDetailHTML(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data.inv_make} ${data.inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/manage", {
    title: "Inventory Management",
    nav,
    errors: null
  })
}

// show add-classification form
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

// process classification form
invCont.registerClassification = async function (req, res) {
  const { classification_name } = req.body
  let nav = await utilities.getNav()
  const regResult = await invModel.addClassification(classification_name)
  if (regResult && regResult.rowCount > 0) {
    // rebuild nav on success so new classification appears
    req.flash("notice", `Classification "${classification_name}" added.`)
    // re-create nav in utilities.getNav when next page loads
    return res.status(201).render("inventory/manage", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the classification was not added.")
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}

// show add inventory form
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classificationList
  })
}

// process new inventory item
invCont.registerInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_image,
    inv_thumbnail
  } = req.body

  let nav = await utilities.getNav()

  // use default images if none provided (optional)
  const image = inv_image && inv_image.length ? inv_image : "/images/no-image.png"
  const thumb = inv_thumbnail && inv_thumbnail.length ? inv_thumbnail : "/images/no-image-thumb.png"

  const result = await invModel.addInventoryItem(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    image,
    thumb
  )

  if (result && result.rowCount > 0) {
    req.flash("notice", `${inv_make} ${inv_model} added to inventory.`)
    // re-render management page with success
    return res.status(201).render("inventory/manage", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the inventory item was not added.")
    // rebuild classificationList to re-show form
    let classificationList = await utilities.buildClassificationList(classification_id)
    return res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classificationList
    })
  }
}


module.exports = invCont