const pool = require("../database/")

/* ***************************
 *  Get all reviews for a specific vehicle
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_rating, r.review_date, 
              a.account_firstname, a.account_lastname
       FROM public.review r
       JOIN public.account a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.review_date DESC`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getReviewsByInventoryId error: " + error)
  }
}

/* ***************************
 *  Add a new review
 * ************************** */
async function addReview(review_text, review_rating, inv_id, account_id) {
  try {
    const sql = `INSERT INTO public.review (review_text, review_rating, inv_id, account_id) 
                 VALUES ($1, $2, $3, $4) 
                 RETURNING *`
    const data = await pool.query(sql, [
      review_text,
      review_rating,
      inv_id,
      account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("addReview error: " + error)
    return error.message
  }
}

/* ***************************
 *  Check if user already reviewed this vehicle
 * ************************** */
async function checkExistingReview(inv_id, account_id) {
  try {
    const sql = `SELECT * FROM public.review WHERE inv_id = $1 AND account_id = $2`
    const data = await pool.query(sql, [inv_id, account_id])
    return data.rowCount
  } catch (error) {
    console.error("checkExistingReview error: " + error)
  }
}

/* ***************************
 *  Get average rating for a vehicle
 * ************************** */
async function getAverageRating(inv_id) {
  try {
    const data = await pool.query(
      `SELECT AVG(review_rating) as avg_rating, COUNT(*) as review_count
       FROM public.review
       WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getAverageRating error: " + error)
  }
}

module.exports = { 
  getReviewsByInventoryId, 
  addReview, 
  checkExistingReview,
  getAverageRating 
}