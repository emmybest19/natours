const express = require('express')
const router = express.Router();
const tourController = require('../controllers/tourController')

// router.param("id", (req, res, next, val) => {
//   console.log(`Tour ID for this is: ${val}`)
//   next()
// })


router.route('/').get(tourController.getTours).post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);



module.exports = router
