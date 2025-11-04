const { status } = require('express/lib/response');
const Tour = require('../models/tourModel');

exports.getTours = async (req, res) => {
  try {
    //Defining the query
    const queryObj = {...req.query}

    //Creating properties or fields that will be excluded

    //Filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])

    //Advance filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    console.log(JSON.parse(queryStr))

    let query =  Tour.find(JSON.parse(queryStr));

    //Sorting the string
    if(req.query.sort) {
      const sortBy = req.query.sort.split('_').join(' ')
      query = query.sort(sortBy)
    }else {
      query = query.sort('-createdAt')
    }

    //executing the query
    const tours = await query
    
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error
    })
    
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.json({
      status: 'success',
      data: {
        tour,
      },
    });
    
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error
    })
    
  }

};
exports.createTour = async (req, res) => {
  try {
    const newTours = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        newTours: newTours,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "Failed to create",
      message: error
    })
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

    res.status(200).json({
      status: 'Success',
      data: {
        tour
      },
    });
    
  } catch (error) {
  res.status(404).json({
    status: "failed",
    message: error
  });
}
}

exports.deleteTour = async (req, res) => {

  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'Success',
      data: null,
    });
    
  } catch (error) {
  res.status(404).json({
    status: "failed",
    message: error
  });
}

};
