var express = require('express');
var body_parser = require('body-parser');
var basic_auth = require('express-basic-auth')
const smtp_data = require('../smtp_api.json')
var app = express();

app.use(body_parser.json({
	limit: '200mb'
}));
app.use(body_parser.urlencoded({
	parameterLimit: 50000,
	limit: '200mb',
	extended: true
}));
app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});
app.use(basic_auth({
  "users": smtp_data.users
}));

var routes = require("./routes/routes.js")(app);
 
var server = app.listen(4000, function () {
  console.log("Listening on port %s...", server.address().port);
});