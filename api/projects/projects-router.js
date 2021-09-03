// Write your "projects" router here!

const express = require('express');
const { validateId, validateProject } = require('./projects-middleware');

const router = express.Router();

const Project = require('./projects-model');

// -  `[GET] /api/projects`
//   - Returns an array of projects as the body of the response.
//   - If there are no projects it responds with an empty array.
router.get('/', (req, res, next) => {
	Project.get()
		.then((projects) => {
			res.status(200).json(projects);
		})
		.catch(next);
});
// -  `[GET] /api/projects/:id`
//   - Returns a project with the given `id` as the body of the response.
//   - If there is no project with the given `id` it responds with a status code 404.

router.get('/:id', validateId, (req, res) => {
	res.json(req.project);
});
// -  `[POST] /api/projects`
//   - Returns the newly created project as the body of the response.
//   - If the request body is missing any of the required fields it responds with a status code 400.

router.post('/', validateProject, async (req, res, next) => {
	try {
		const newProject = await Project.insert({
			name: req.name,
			description: req.description,
			completed: req.completed,
		});
		res.status(201).json(newProject);
	} catch (error) {
		next(error);
	}
});
// -  `[PUT] /api/projects/:id`
//   - Returns the updated project as the body of the response.
//   - If there is no project with the given `id` it responds with a status code 404.
//   - If the request body is missing any of the required fields it responds with a status code 400.

router.put('/:id', validateId, validateProject, (req, res, next) => {
	Project.update(req.params.id, {
		name: req.name,
		description: req.description,
		completed: req.completed,
	})
		.then(() => {
			return Project.get(req.params.id);
		})
		.then((project) => {
			res.json(project);
		})
		.catch(next);
});
// -  `[DELETE] /api/projects/:id`
//   - Returns no response body.
//   - If there is no project with the given `id` it responds with a status code 404.
router.delete('/:id', validateId, async (req, res, next) => {
	try {
		await Project.remove(req.params.id);
		res.json(res.Project);
	} catch (error) {
		next(error);
	}
});
// -  `[GET] /api/projects/:id/actions`
//   - Returns an array of actions (could be empty) belonging to a project with the given `id`.
//   - If there is no project with the given `id` it responds with a status code 404.
router.get('/:id/actions', validateId, async (req, res, next) => {
	try {
		await Project.getProjectActions(req.params.id).then((actions) => {
			if (actions.length > 0) {
				res.status(200).json(actions);
			} else {
				res.status(404).json(actions);
			}
		});
	} catch (error) {
		next(error);
	}
});

router.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		customeMessage: 'something went wrong while sending ruquest',
		message: err.message,
		stack: err.stack,
	});
});
module.exports = router;
