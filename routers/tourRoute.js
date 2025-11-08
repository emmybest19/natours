const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// router.param("id", (req, res, next, val) => {
//   console.log(`Tour ID for this is: ${val}`)
//   next()
// })
//Adding a route for to handle routes i used often

router
  .route('/top-5-tours').get(tourController.filteredTours, tourController.getTours);

router.route('/tours-stats').get(tourController.getTourStats)
router.route('/tour-plan-per-month/:year').get(tourController.getToursPlansPerMonth)

router.route('/').get(tourController.getTours).post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
