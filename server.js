const mongoose = require('mongoose'); // mongoose is used to connect our DB in the application
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); //--> this will just read the environment variable from config.env file and store them inside the javascript environment variables so that you can access the variables from any file
//config file should be required before requiring the app.
const app = require('./app');

///////////////////////////////////////////////
// CONNECTING DB AND APPLICATION
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
); //DB will contain our connection string

//using mongoose we connect our application to database, while using mongoose to connect to database, we pass some options which are used in deprecation warnings
mongoose
  .connect(DB, {
    //mongoose.connect will return a promise
    // for connecting to localdatabse pass process.env.DATABASE_LOCAL instead of DB
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    //console.log(con.connections);   //--> this will output the connection log
    console.log('DB connection successful!');
  });

//////////////////////////////////////////////////

// //creating schema
// const tourSchema = new mongoose.Schema({
//   //this can also be called as describing our data
//   // name: String,    //we want a name of the tour and its type is going to be string, we can even set more to the name
//   name: {
//     //this object here is the schema type options
//     type: String,
//     // required: true    //we can specify the error when we are missing this field
//     required: [true, 'A tour must have a name'],
//     unique: true
//   },
//   // rating: Number,
//   rating: {
//     type: Number,
//     default: 4.5
//   },
//   // price: Number
//   price: {
//     type: Number,
//     required: [true, 'A tour must have a price']
//   }
// });

// //creating model from the schema
// const Tour = mongoose.model('Tour', tourSchema); //its a convetion to use uppercase in model name, it takes the name of the model and the schema
// //this Tour name will be used to name the database collection but there it will be plural (tours) with all small letters
//--> we have put the create model code in Models->tourModel.js file

//using our mongoose model to create a document
// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 497
// }); // testTour is an instance of Tour so it has some function and methods available on it

// //Saving the created testTour to database
// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => {
//     console.log('Error 💥', err);
//   }); // this functions call will save the the testTour to our database called natours, and this save method returns a promise

//Lifecycle of building a document in database is: schema->model->document->document.save()     //save() is a method available in mongoose
//console.log(app.get('env')); //--> this will log out the env as development, this is the environment that we are currently in
//console.log(process.env); //--> this will output all the environment variables of node when we sart the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on ${port}`);
});

//handling the unhandlled rejection that is generated when we are not able to connect to the database
//this will handle all the unhandled promise in our application if they are not handled at that time
//👇 this code stop the server if the load time of database is more than expected
// process.on('unhandledRejection', err => {
//   console.log(err.name, err.message);
//   console.log('UNHANDLED REJECTION! 🔥shutting down...');

//   //shutting down the server gracefully
//   server.close(() => {
//     //putting the process.exit() inside shuts the server gracefully
//     process.exit(1); //process.exit() will shut down our application, it recieves a code 0 for success and 1 for exceptions, this will basically shuttdown the server immediatly,
//   });
// });

//👇this code should be at top
// process.on('uncaughtException', err => {
//   console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
