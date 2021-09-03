// Write your "actions" router here!

const express = require('express');
const { validateid, ValidateAction } = require('./actions-middlware');

const router = express.Router();

const Action = require('./actions-model');
//  `[GET] /api/actions`
//   - Returns an array of actions (or an empty array) as the body of the response.
router.get('/', async (req, res, next) => {
	try {
		const users = await Action.get();
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
});
//  `[GET] /api/actions/:id`
//   - Returns an action with the given `id` as the body of the response.
//   - If there is no action with the given `id` it responds with a status code 404.

router.get('/:id', validateid, (req, res) => {
	res.json(req.actions);
});
//  `[POST] /api/actions`
//   - Returns the newly created action as the body of the response.
//   - If the request body is missing any of the required fields it responds with a status code 400.
//   - When adding an action make sure the `project_id` provided belongs to an existing `project`.

router.post('/', ValidateAction, async (req, res, next) => {
	Action.insert(req.body)
		.then((action) => {
			res.status(201).json(action);
		})
		.catch((err) => next(err));
});
//  `[PUT] /api/actions/:id`
//   - Returns the updated action as the body of the response.
//   - If there is no action with the given `id` it responds with a status code 404.
//   - If the request body is missing any of the required fields it responds with a status code 400.

router.put('/:id', validateid, ValidateAction, (req, res, next) => {
	Action.update(req.params.id, req.body)
		.then((updatedAction) => {
			res.status(200).json(updatedAction);
		})
		.catch((err) => next(err));
});
//  `[DELETE] /api/actions/:id`
//   - Returns no response body.
//   - If there is no action with the given `id` it responds with a status code 404.
router.delete('/:id', validateid, async (req, res, next) => {
	try {
		await Action.remove(req.params.id);
		res.json(res.Action);
	} catch (err) {
		next(err);
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
