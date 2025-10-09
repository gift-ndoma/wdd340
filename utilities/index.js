const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.forEach((row) => {
    list += "<li>"
    list += '<a href="/inv/type/' + row.classification_id + '" title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailHTML = async function(data){
  let detail = ""
  if(data){
    detail += '<div class="vehicle-detail">'
    detail += '<div class="vehicle-image">'
    detail += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + '">'
    detail += '</div>'
    detail += '<div class="vehicle-info">'
    detail += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details</h2>'
    detail += '<p class="price">Price: $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
    detail += '<p><strong>Year:</strong> ' + data.inv_year + '</p>'
    detail += '<p><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + ' miles</p>'
    detail += '<p><strong>Color:</strong> ' + data.inv_color + '</p>'
    detail += '<p><strong>Description:</strong> ' + data.inv_description + '</p>'
    detail += '</div>'
    detail += '</div>'
  } else { 
    detail += '<p class="notice">Sorry, no vehicle details could be found.</p>'
  }
  return detail
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



/* ****************************************
 *  Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }


 /* **************************************
* Build the classification select list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}


/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
 

/* **************************************
* Build the reviews HTML for vehicle detail page
* ************************************ */
Util.buildReviewsHTML = async function(reviews, avgRating) {
  let html = '<div class="reviews-section">'
  
  // Display average rating if reviews exist
  if (reviews && reviews.length > 0) {
    const avg = parseFloat(avgRating.avg_rating).toFixed(1)
    const count = avgRating.review_count
    html += `<h3>Customer Reviews</h3>`
    html += `<div class="average-rating">`
    html += `<span class="rating-stars">${buildStarRating(avg)}</span>`
    html += `<span class="rating-text">${avg} out of 5 stars (${count} ${count === 1 ? 'review' : 'reviews'})</span>`
    html += `</div>`
    
    // Display individual reviews
    html += '<div class="reviews-list">'
    reviews.forEach(review => {
      const reviewDate = new Date(review.review_date).toLocaleDateString()
      html += `<div class="review-item">`
      html += `<div class="review-header">`
      html += `<span class="review-stars">${buildStarRating(review.review_rating)}</span>`
      html += `<span class="review-author">by ${review.account_firstname} ${review.account_lastname}</span>`
      html += `<span class="review-date">${reviewDate}</span>`
      html += `</div>`
      html += `<div class="review-text">${review.review_text}</div>`
      html += `</div>`
    })
    html += '</div>'
  } else {
    html += '<h3>Customer Reviews</h3>'
    html += '<p>No reviews yet. Be the first to review this vehicle!</p>'
  }
  
  html += '</div>'
  return html
}

/* **************************************
* Build star rating display (helper function)
* ************************************ */
function buildStarRating(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  
  let stars = ''
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars += '★'
  }
  // Half star
  if (hasHalfStar) {
    stars += '☆'
  }
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars += '☆'
  }
  
  return stars
}

module.exports = Util