const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

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



app.get('/', (req, res) => {
  res.send('Hello, Welcome to Nesto Server!');
});


app.get('/nesto/login', (req, res) => {
  var usr = req.query.usr;
  var pwd = req.query.pwd;
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
app.get('/nesto/getProducts', authenticateJWT, (req,  res) => {
  res.json(products);
});
app.get('/nesto/getProductDetails',authenticateJWT, (req, res) => {
  res.json(productDetails);
});

function generateJWT(payload) {
  return jwt.sign(payload, "nesto", { expiresIn: '1h' });
}

