const { status } = require('express/lib/response');
const Tour = require('../models/tourModel');
const APIFeatures = require('../util/apiFeatures');

exports.filteredTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';

  next();
};

exports.getTours = async (req, res) => {
  try {
    //1A) Defining the query
    // const queryObj = {...req.query}

    // //Creating properties or fields that will be excluded

    // //Filtering
    // const excludedFields = ['page', 'sort', 'limit', 'fields']
    // excludedFields.forEach(el => delete queryObj[el])

    // //1B)Advance filtering
    // let queryStr = JSON.stringify(queryObj)
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    // console.log(JSON.parse(queryStr))

    // let query =  Tour.find(JSON.parse(queryStr));

    //2)Sorting the string
    // if(req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ')
    //   query = query.sort(sortBy)
    // }else {
    //   query = query.sort('-createdAt')
    // }

    //3) limiting fields

    // if(req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ")
    //   query = query.select(fields)
    // }else {
    //   query = query.select('-__v')
    // }

    //4) Pagination
    //To execute pagination you have to first define the page, the limit and the skip process
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 20;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit)

    // //Defining pages that dont exist
    // if(req.query.page) {
    //   const newTours = await Tour.countDocuments()
    //   if(skip >= newTours) throw new Error("There is no such page existing");
    // }

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitingFields()
      .pagination();
    //executing the query
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
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
      status: 'failed',
      message: error,
    });
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
      status: 'Failed to create',
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {

    const stats = await Tour.aggregate([
      //always remember that you can add more than one matching pipeline statement
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: {$toUpper: '$difficulty'},
          numTours: {$sum: 1},
          numRating: {$sum: '$ratingsQuantity'},
          avgRating: {$avg: '$ratingsAverage'},
          avgPrice: {$avg: '$price'},
          minPrice: {$min: '$price'},
          maxPrice: {$max: '$price'},
        }
      },
      {
        $sort: {avgPrice: -1}
      },
      //in correspondence to the statement i made up there
      {
        $match: {_id: {$ne: 'EASY'}}
      }
    ]);

    res.status(200).json({
      message: "success",
      data: {
        stats
      }
    })
  } catch(error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.getToursPlansPerMonth = async (req, res) => {
  try {
    const year = req.params.year * 1;

  const plans = await Tour.aggregate([
    //using the unwind to spread the startDate to individual documents
    {
      $unwind: "$startDates"
    }, 
    {
      $match: {
        startDates: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)

      }
    }
    },

    {
      $group: {
        _id: {$month: '$startDates'},
        numToursStat: {$sum: 1},
        tours: {$push: '$name'}
      }
    },
    {
      $sort: {_id: 1}
    },
    // {
    //   $limit: 5
    // }
    
  ])
  
  res.status(200).json({
    status: "Success",
    result: plans.length,
    data: {
      plans
    }
  })
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "Failed to carry out operation"
    })
  }
  
}
