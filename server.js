const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const app = require('./app')



const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB).then(console.log("connection successful")
).catch(err => console.log("Error occured during the preocess of connecting to the database: ", err))


app.listen(process.env.PORT, () => {
  console.log(`Your port is running at port: ${process.env.PORT}...`);
})
