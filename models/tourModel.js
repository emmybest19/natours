const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please you cant skip the name'], unique: true },
  duration: {type: Number, required: [true, 'Please tours must have a duration']},
  maxGroupSize: {type: Number, required: [true, "You must provide how many you are in a group"]},
  difficulty: {type: String, required: [true, 'You must provide at least the difficulty you passed through in finding this place']},
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },
  price: { type: Number, required: true },
  discount: {type: Number},
  summary: {
    type: String, 
    trim: true,
    required: [true, "A description is honestly important"]
  },
  description: {
    type: String,
    trim: true
  }, 
  imageCover: {
    type: String,
    required: [true, "Having a cover page is extremely important"]
  }, 
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }, 
  startDates: [Date]
});


//implementing virtual properties 
const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
