// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const reviewValidate = require("../utilities/review-validation")

// Route to process adding a review
router.post(
  "/add",
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

module.exports = router