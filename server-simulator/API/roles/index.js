import express from 'express'
const router = express.Router()

const roles = require('../json/roles.json')

/**
 * @apiGroup Roles
 * @api {GET} /roles/list all roles
 * @apiDescription return all roles
 * @apiExample {curl} Example usage:
 *		curl -i http://localhost/roles/list
 *
 * @apiSuccess (Success) {String} roleId roleId
 * @apiSuccess (Success) {String} roleName roleName
 * @apiSuccess (Success) {Object[]} functionNames functionNames
 * @apiSuccess (Success) {String} functionNames.functionName functionName
 * @apiSuccess (Success) {String} functionNames.create can create
 * @apiSuccess (Success) {String} functionNames.read can red
 * @apiSuccess (Success) {String} functionNames.update can update
 * @apiSuccess (Success) {String} functionNames.delete can delete
 * @apiSuccessExample {json} Success-Response:
 *		HTTP/1.1 200 OK
 *		[{
 *		  "roleId": "001",
 *		  "roleName": "Trading Solutions Analyst",
 *		  "functionNames": [{
 *		    "functionName": "Event Template - Data Feed Rating - Fixture Before Start Sell",
 *		    "create": "Yes",
 *		    "read": "Yes",
 *		    "update": "Yes",
 *		    "delete": "No"
 *		  }, {
 *		    "functionName": "Event Template - General & Structure Setting",
 *		    "create": "Yes",
 *		    "read": "Yes",
 *		    "update": "Yes",
 *		    "delete": "Yes"
 *		  }]
 *		}, {
 *		  "roleId": "002",
 *		  "roleName": "Trading Supervisor",
 *		  "functionNames": [{
 *		    "functionName": "Event Template - Bet Type Preference, Expected Business Start Sell Time & Odds Submission Deadline",
 *		    "create": "Yes",
 *		    "read": "Yes",
 *		    "update": "Yes",
 *		    "delete": "No"
 *		  }, {
 *		    "functionName": "Event Template",
 *		    "create": "No",
 *		    "read": "Yes",
 *		    "update": "No",
 *		    "delete": "No"
 *		  }]
 *		}]
 */
router.get('/list', (req, res) => {
	let result = roles

	res.send(result)
})

export default router
