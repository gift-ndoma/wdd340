const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 *  Process adding a review
 * ************************** */
reviewCont.addReview = async function (req, res, next) {
  const { review_text, review_rating, inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  // Check if user already reviewed this vehicle
  const existingReview = await reviewModel.checkExistingReview(inv_id, account_id)
  
  if (existingReview > 0) {
    req.flash("notice", "You have already reviewed this vehicle.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }

  const reviewResult = await reviewModel.addReview(
    review_text,
    review_rating,
    inv_id,
    account_id
  )

  if (reviewResult) {
    req.flash("notice", "Thank you for your review!")
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Sorry, adding the review failed.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

module.exports = reviewCont