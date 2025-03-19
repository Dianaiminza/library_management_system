var express = require('express');
var path = require('path');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
var bookRoute = require('./routes/bookRoute');
var borrowRoute = require('./routes/borrowRoute');
var reportRoute = require('./routes/reportRoute');
var userRoute = require('./routes/usersRoute');

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

require('dotenv').config()
app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, '//frontend/public')));


app.use(bodyParser.json());
app.use('/api/books', bookRoute);
app.use('/api/borrow', borrowRoute);
app.use('/api/report', reportRoute);
app.use('/api/users', userRoute);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Your application routes go here...
app.listen(process.env.PORT || 5000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    console.log(`Express server listening on port ${PORT}`);
    console.log(`Base URL is ${BASE_URL}`);
});
module.exports = app;