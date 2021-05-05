const express = require('express')
// const morgan = require('morgan');
const dotenv = require('dotenv');
//const path = require('path');
const bodyParser = require('body-parser')
const { name, version } = require('./package.json')

dotenv.config();

const app = express();
// app.set('port', process.env.PORT || 3000);

// app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/student', require('./routes/student'));
app.use('/teacher', require('./routes/teacher'));
app.use('/schedule', require('./routes/schedule'));

app.listen(process.env.PORT, async () => {
    console.log(`The ${ name } starts at ${process.env.PORT}(${ version })`);
})