// add middlewares here related to projects

const Project = require('./projects-model');

function logger(req, res, next) {
	const timestamp = new Date().toLocaleDateString();
	const method = req.method;
	const url = req.originalUrl;
	console.log(`[${timestamp}] ${method} ${url}`);
	next();
}

// tring out try and catch method on id validation
async function validateId(req, res, next) {
	try {
		const project = await Project.get(req.params.id);
		if (!project) {
			next({ status: 404, message: 'project not found' });
		} else {
			req.project = project;
			next();
		}
	} catch (error) {
		next(error);
	}
}

async function validateProject(req, res, next) {
	const { name, description, completed } = req.body;
	if (!name || !name.trim()) {
		res.status(400).json({
			message: 'name is required',
		});
	} else if (!description || !description.trim()) {
		res.status(400).json({
			message: 'description is requared',
		});
	} else {
		req.name = name.trim();
		req.description = description.trim();
		req.completed = completed;
		next();
	}
}

module.exports = { validateId, validateProject, logger };
