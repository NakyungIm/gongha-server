const express = require('express');
// const morgan = require('morgan');
const dotenv = require('dotenv');
//const path = require('path');
const bodyParser = require('body-parser');
const { name, version } = require('./package.json');

dotenv.config();

const app = express();
// app.set('port', process.env.PORT || 3000);

// app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/student', require('./routes/student'));
app.use('/teacher', require('./routes/teacher'));
app.use('/schedule', require('./routes/schedule'));
app.use('/email', require('./routes/email'));



// app.use(function(req, res, next) {
//     res.status(404).send('404 Not Found. Sorry can\'t find that!');
// });

// app.use(function (err, req, res, next) {
//     console.error(err.stack)
//     res.status(500).send('500 Internal Server Error.\nSomething broke!')
// })

app.listen(process.env.PORT, async () => {
  console.log(`The ${name} starts at ${process.env.PORT}(${version})`);
});
