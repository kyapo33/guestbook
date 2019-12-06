const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
var path = require('path');
require("dotenv").config()

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useFindAndModify: false
}).then(() => console.log('db connect'));

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

const authRoutes = require('./routes/auth');

app.use('/api', authRoutes);

const port = process.env.PORT
app.listen(port, () => {
    console.log('Server is running');
});