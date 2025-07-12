const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/dbconnect');
const routers = require('./routers/index');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routers)
// connectDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}
);