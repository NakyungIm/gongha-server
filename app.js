const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { name, version } = require('./package.json');
const { json } = require('./middlewares/result');
dotenv.config();

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/student', require('./routes/student'));
app.use('/teacher', require('./routes/teacher'));
app.use('/schedule', require('./routes/schedule'));
app.use('/email', require('./routes/email'));

app.use(json.notFound);
app.use(json.result);
app.use(json.internalServerError);

app.listen(process.env.PORT, async () => {
  console.log(`The ${name} starts at ${process.env.PORT}(${version})`);
});
