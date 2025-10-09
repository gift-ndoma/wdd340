const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Review must be at least 10 characters long."),

    body("review_rating")
      .trim()
      .isInt({ min: 1, max: 5 })
      .withMessage("Please select a rating between 1 and 5 stars."),

    body("inv_id")
      .trim()
      .isInt()
      .withMessage("Invalid vehicle ID."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add review
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the errors in your review.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
  next()
}

module.exports = validate