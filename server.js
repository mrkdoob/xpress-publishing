const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./api/api');

app.use(express.static('public'));

const PORT = process.env.PORT || 4000;

app.use(cors());

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
