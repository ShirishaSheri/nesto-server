const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json())

const port = process.env.PORT || 3000;
const fs = require('fs');
var products = {}
var productDetails = {}

//// Dummy Data loading
fs.readFile('./data/products.json', function(err, data) { 

    if (err) throw err; 

    products = JSON.parse(data); 
   
});
fs.readFile('./data/productDetails.json', function(err, data) { 

    if (err) throw err; 

    productDetails = JSON.parse(data); 
   
});  
var logins =  [
              {username:'Shirisha',password:'shirisha123'},
              {username:'user1',password:'user123'},
              ]
const authenticateJWT = (req, res, next) => {
      if (!req.header('Authorization')) {
        return res.status(401).send('Access Denied');
    }
    var token = req.header('Authorization').split(' ')[1];
    console.log('token is ' + token);
    if (!token) {
        return res.status(401).send('Access Denied');
    }
    jwt.verify(token, "nesto", (err, user) => {
        if (err) return res.status(401).send('Invalid Token'); 
        req.user = user;
        next();
    });
};

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


//Fetch Home Page Details
app.get('/nesto/home', (req, res) => {
  res.send('Hello, Welcome to Nesto Server!');
});

//Login 
app.post('/nesto/login', (req, res) => {
  var usr = req.body.username;
  var pwd = req.body.password;
 
  let obj = logins.find(o => o.username === usr);
  if(obj== undefined)
   {
      res.send('Invalid user, Please register!');
   }
   else
   {
      if(obj.password === pwd)
      {
        const token = generateJWT(obj)
        res.json(
          {
            login:"true",
            token:token
          }
        )
     
      }
      else 
        res.send('login, failed!');
    }
});
//Get All Hotels
app.get('/nesto/getProducts', authenticateJWT, (req,  res) => {
  res.json(products);
});
//Get  Hotel Details
app.get('/nesto/getProductDetails',authenticateJWT, (req, res) => {
  var hotelname = req.body.hotel;
  console.log('hotel is ' +hotelname);
  res.json(productDetails);
});

//Post  Booking Summary
app.post('/nesto/bookingsummary', function (req, res) {
    var bookingsummary = req.body;
    console.log(bookingsummary);

    return res.send('Booking Done');
});
//Post  payment Summary
app.post('/nesto/paymentSummary', function (req, res) {
    var paymentSummary = req.body;
    console.log(paymentSummary);

    return res.send('Payment Confirmed');
});
//Booking Confirmation
app.get('/nesto/getconfirmation',authenticateJWT, (req, res) => {
  return res.send('Booking Confirmed');
});
function generateJWT(payload) {
  return jwt.sign(payload, "nesto", { expiresIn: '1h' });
}

