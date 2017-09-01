var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var jwt = require("jsonwebtoken");
var auth = require("./auth.js")();
var users = require("./users.js");
var cfg = require("./config.js");
var app = express();

app.use(bodyParser.json());
app.use(auth.initialize());

app.get("/", function(req, res) {
    res.json({
        status: "My API is alive!"
    });
});

const getToken = async (payload) => {
  var cert = fs.readFileSync('./secretb');  // get private key
  var token = await jwt.sign(payload, cert, { algorithm: 'RS256', expiresIn: 60 });
  return token;
}

const verifyToken = (token) => {
  var cert = fs.readFileSync('./secretb.pem');  // get public key
  return jwt.verify(token, cert, { algorithms: ['RS256'] }, function(err, decoded) {
    console.log('verifyToken______:', decoded)
    console.log('verifyToken__err_:', err)
  });
}

app.get("/user", auth.authenticate(), function(req, res) {
// app.get("/user", verifyToken(), function(req, res) {
  console.log('/user::req', req.user);
  res.json(users.find(x => x.id === req.user.id));
});

app.post("/token", async (req, res) => {
  if (req.body.email && req.body.password) {
      var email = req.body.email;
      var password = req.body.password;
      console.log("body...", {email, password, body: req.body});
      var user = users.find(u => u.email === email && u.password === password);
      if (user) {
        var payload = {
          id: user.id,
          name: user.name,
          //exp: Math.floor(Date.now() / 1000) + (60 * 60)
        };
        var token = await getToken(payload);
        verifyToken(token);
        res.json({
          token: token
        });
      } else {
        res.sendStatus(401);
      }
  } else {
    res.sendStatus(401);
  }
});

app.listen(3003, function() {
    console.log("My API is running...");
});

module.exports = app;
