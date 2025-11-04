const mongoose = require('mongoose')
const fs = require('fs')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')
dotenv.config({path: './config.env'})




const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB).then(console.log("connection successful")
).catch(err => console.log("Error occured during the preocess of connecting to the database: ", err))

//Reading the json file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

//IMPORTING DATA INTO DB

const importData  = async () => {
    try {
       await Tour.create(tours) 
       console.log("Data successfully loaded")
        
    } catch (error) {
        console.log(error)
        
    }
    process.exit()
}

//DELETING DATA FROM THE DATABASE

const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log("Data deleted successfully")
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

if(process.argv[2] === '--import') {
    importData()
} else if(process.argv[2] === '--delete') {
    deleteData()
}

// console.log(process.argv)