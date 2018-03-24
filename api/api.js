const express = require('express');
const apiRouter = express.Router();
const artistsRouter = require('./artistsRouter.js');
const seriesRouter = require('./seriesRouter.js');
const issuesRouter = require('./issuesRouter.js');

module.exports = apiRouter;

apiRouter.use('/artists', artistsRouter);

apiRouter.use('/series', seriesRouter);

apiRouter.use('/issues', issuesRouter);
