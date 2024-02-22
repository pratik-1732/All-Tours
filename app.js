// const fs = require('fs');
const path = require('path'); //no need to install path from npm, path is a build in node module which is used to manipulate the pathName
const express = require('express'); //-->imported the express function, and express adds a bunch of function to our app.js
const morgan = require('morgan'); //--> morgan is a middelware that does basically HTTP request logger
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const compression = require('compression');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

//**Here at the start of the app we set the app to use pug as view engine */

app.set('view engine', 'pug'); //pug templates are called views in express
app.set('views', path.join(__dirname, 'views')); //this will create the path to views behind the process

//**Serving static files */
app.use(express.static(path.join(__dirname, 'public'))); //all the static assets will be served from this folder

// ** USING MIDDLEWARE : GLOBAL MIDDLEWARES

//**Using helmt */
//Set security HTTP headers
//always put the helmet middleware at top in middleware stack
app.use(helmet()); //In app.use we always need a function not a function call. BUt we are calling helmet() function which in return will produce a funcion.

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //--> this is only used when we are in development environment
}

const limiter = rateLimit({
  //rateLimit function receives an object of options.
  max: 100, //How many request are allowed from an IP in certain interval of time
  windowMs: 60 * 60 * 1000, // 1 Hour this will allow 100 request from same IP in 1 hour. windowMs == windowmiliseconds
  message: 'Too many request from this IP, please try again in an hour!' //this error comes with a code of 429 which means too many requests from same IP address
});
app.use('/api', limiter); //this apply the limiter only to the route starting wih api

//app.use(morgan('dev')); //--> this middelware will be applied to all the routes

//**Body parser, reading data from body into req.body*/
//app.use(express.json()); //-->express.json() is called middleware, this middleware will be applied to all routes

//**We can limit the size of body */
app.use(express.json({ limit: '10kb' })); //this option will limit the body to 10 kb size

//To get data from the form we are adding this line of code👇
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //this will basically parse data coming from the url encoded form, extended is set to true so that complex data could be sent

//**Cookie parser, reading data from cookie */
app.use(cookieParser());

//**Data sanitization against NoSQL query injection */
app.use(mongoSanitize()); //mongoSanitize is a function which we will call and then it will return a middleware function. This will prevent from attacks

//**Data sanitization against XSS attack */
app.use(xss()); //this will clean malacius code in html code

//**Prevent parameter pollution */
app.use(
  hpp({
    whitelist: ['duration', 'difficulty']
  })
); //we can even pass an object of whitelist some parameter

//using built-in middleware of express
//app.use(express.static(`${__dirname}/public`)); //-->static because we want to serve static file to browser, we can now serve the files from public directory to the browser, and this is a way to render static page from folders and not from routes
// app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  //this middleware applies to each and every request
  console.log('Hello you are using middleware');
  next(); //--> never forget to use this next function when you are dealing with middleware
});

app.use(compression());
//adding a time middleware
app.use((req, res, next) => {
  //--> this middleware is applied to all the routes
  req.requestTime = new Date().toISOString(); //--> this middleware creates the requeste time to every middleware after it, so we can use that time where it is required
  //console.log(req.cookies); //just to test whate do we get from headers when we make a request
  next();
});
// app.get('/', (req, res) => {
//--> here get is the http method for the request
//   res.status(200).send(`Hello from the server side!`);  //-->this line of code will send the string to the browser
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' }); //-->here we need not to define content-type to application/json manually as we have done in farm project
// });

//--> GET and POST are different http methods

// app.post('/', (req, res) => {
//   res.status(200).send('you can post in this endpoint...'); //--> multiple res.send ek saath nahi kar sakte
//   res.status(200).send('This is a http post method');
// });

// reading file of all tours
//--> putting this in tourRoutes.js file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

//reading file of tour that is going to add
// const newTour = JSON.parse(
//   fs.readFileSync(`${_dirname}/dev-data/data/tours.json`)
// );

//creating the function for http methods

//PUTTING ALL THE TOURS FUNCTION TO tourRoutes.js

// const getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// };

// const getTour = (req, res) => {
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }
//   const tour = tours.find((el) => el.id === id);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// };

// const createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         //--> 201 means created
//         status: 'success',
//         data: {
//           tours: newTour,
//         },
//       });
//     }
//   );
// };

// const updateTour = (req, res) => {
//   if (req.params.id > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated the file...>',
//     },
//   });
// };

// const deleteTour = (req, res) => {
//   if (req.params.id > tours.lenght) {
//     res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null, //we don't send back any data
//   }); //204 means no content
// };

//now we have put all our users function to userRoutes.js file
// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     //500 is for server error
//     status: 'err',
//     message: 'this route is not yet build',
//   });
// };

// const createUser = (req, res) => {
//   res.status(500).json({
//     //500 is for internal server error
//     status: 'err',
//     message: 'this route is not yet build',
//   });
// };

// const getUser = (req, res) => {
//   res.status(500).json({
//     //500 is for server error
//     status: 'err',
//     message: 'this route is not yet build',
//   });
// };

// const updateUser = (req, res) => {
//   res.status(500).json({
//     //500 is for server error
//     status: 'err',
//     message: 'this route is not yet build',
//   });
// };

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     //500 is for server error
//     status: 'err',
//     message: 'this route is not yet build',
//   });
// };

//**Creating the routes for rendering the page dynamically */
//this route will render the base template
// app.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'The Forest Hike', // we can pass the data to base file that can be used in base.pug file
//     user: 'Jonas'
//   }); //no need to specify the pug extension express will automatically detect it, it will go into the views folder specified above
// });

// app.get('/overview', (req, res) => {
//   res.status(200).render('overview', {
//     title: 'All Tours'
//   });
// });

// app.get('/tour', (req, res) => {
//   res.status(200).render('tour', {
//     title: 'The Forest Hiker'
//   });
// });

//Mounting the viewRouter on app
app.use('/', viewRouter);

//CREATING A TOURROUTER

//this is called mounting of routes
// const tourRouter = express.Router(); //-->tourRouter is a middelware, put this in file tourRoutes.js

//-->mounting the routers over here
app.use('/api/v1/tours', tourRouter); //--> using tourRouter as a middelware for specified route
//similarly creating usersRouter
// const userRouter = express.Router(); //-->put this file in userRoutes.js
app.use('/api/v1/users', userRouter); //--> this middleware applies to only specified routes

//**mounting the review routes */
app.use('/api/v1/reviews', reviewRouter); //whenever there is a request that starts like /api/v1/reviews then the specified routes will will be executed (reviewRouter).

//if routes do not matches the tourRouter and userRouter then we can handle that route here by defining a middleware called route handler
app.all('*', (req, res, next) => {
  //here we want to handle all the url that were not handled before we used (*)
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });
  //creating a new error to test our global error handling middleware
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404); //here next point to the apperror if not then this will go to the next middleware
}); //we use app.all because we want to handle all type of http req(get, post, patch, del)

//DEFINING A GLOBAL ERROR HANDLING MIDDLEWARE
// app.use((err, req, res, next) => {
//   console.log(err.stack);
//   //this is recognised as a error middelware and is called by express when there is an error, by defining four parameters express automatically knows that it is a error handling middelware
//   err.statusCode = err.statusCode || 500; // the statusCode is available in err object, 500 code is used for internal server error
//   err.status = err.status || 'error'; // it will contain the status of the error
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   });
// });

app.use(globalErrorHandler);
// ** HANDLING GET REQUEST
// app.get('/api/v1/tours', (req, res) => {
//--> '/api/v1/tours' this is our route v1 is the version number of the api and the function (req,res)=>{} is called route handler
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// });

// now we are putting a name function in place of callback function
// app.get('/api/v1/tours', getAllTours);  //--> this is done in chaining the route part down side

// ** RESPONDING TO URL PARAMETER(param)
// app.get('/api/v1/tours/:id', (req, res) => {
//--> '/api/v1/tours/:id' here : colon is used to put any variable in place of id, in place of id it could be anything like x,var
//--> '/api/v1/tours/:id/:x?/:var?' here x and var params are optional
//   console.log(req.params);
// const id = req.params.id * 1; //--we multiplied with to convert string to number

//   if (id > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }
//   const tour = tours.find((el) => el.id === id);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// });

//now using getTour function instead of specifying the callback function
// app.get('/api/v1/tours/:id', getTour);

// ** HANDLING POST REQUEST  (adding new tour)
// app.post('/api/v1/tours', (req, res) => {
//--> post is done to add some new data so the new data will be coming from client, so new data will be in req, but out of the box express do not put that data in req, so we will use middleware
//   console.log(req.body); //-->req has now a property called body due to the middleware
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         //--> 201 means created
//         status: 'success',
//         data: {
//           tours: newTour,
//         },
//       });
//     }
//   );

//   //   res.send('Done');
// });

//now using createTour function instead of specifying callback function to the post method
// app.post('/api/v1/tours', createTour);  //--> this is done in chaining the route part down side

// ** HANDLING PATCH REQUEST(to update data)
// app.patch('/api/v1/tours/:id', (req, res) => {
//   if (req.params.id > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated the file...>',
//     },
//   });
// });

//now calling the patch method by using the updateTour function instead of specifying the callback function
// app.patch('/api/v1/tours/:id', updateTour);

// ** HANDLING DELETE REQUEST
// app.delete('/api/v1/tours/:id', (req, res) => {
//   if (req.params.id > tours.lenght) {
//     res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }

//   res.status(204).json({
// status: 'success',
// data: null, //we don't send back any data
// }); //204 means no content
// });

//now using deleteTour function
// app.delete('/api/v1/tours/:id', deleteTour);

// ** WE CAN CHAIN THE ROUTE SO THAT SAME ROUTE DO NOT REPEAT
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

//we can now replace app with tourRouter because we have made tourRouter = express.Router()
// tourRouter.route('/').get(getAllTours).post(createTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);  //--> put in tourRoutes.js file

//CREATING THE USER API
// userRouter.route('/').get(getAllUsers).post(createUser);

// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

//--> we can create the server by using http but we have done that in farm project and now here we will create server by using express

//START THE SERVER
//-->we will create a sepearte file for server
// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on ${port}`);
// });

module.exports = app;
