// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!

const express = require('express');
const server = express();
const projectRouter = require('./projects/projects-router');
const actionsRouter = require('./actions/actions-router');

function logger(req, res, next) {
	const timestamp = new Date().toLocaleDateString();
	const method = req.method;
	const url = req.originalUrl;
	console.log(`[${timestamp}] ${method} ${url}`);
	next();
}

server.use(express.json());
server.use('/api/projects', logger, projectRouter);
server.use('/api/actions', logger, actionsRouter);

server.get('/', (req, res) => {
	res.send('<h1>Start of sprint project</h1>');
});
module.exports = server;
