// add middlewares here related to actions
const Action = require('./actions-model');
const Project = require('../projects/projects-model');

async function validateid(req, res, next) {
	try {
		const actions = await Action.get(req.params.id);

		if (!actions) {
			next({ status: 404, message: 'action not found' });
		} else {
			req.actions = actions;
			next();
		}
	} catch (error) {
		next(error);
	}
}
async function ValidateAction(req, res, next) {
	const { project_id, description, notes } = req.body;
	if (project_id && description && notes) {
		try {
			const project = await Project.get(project_id);
			if (project) {
				next();
			} else {
				res.status(400).json({
					message: 'Please provide an existing project_id',
				});
			}
		} catch (err) {
			next(err);
		}
	} else {
		res.status(400).json({
			message: 'Please provide description and notes',
		});
	}
}
module.exports = { validateid, ValidateAction };
