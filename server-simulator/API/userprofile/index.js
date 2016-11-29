import express from 'express'
import UserProfileUtil from './userprofile-util'
import _ from 'lodash'

const router = express.Router()

const accountProfiles = require('../json/accountprofiles.json')
const basicUsers = require('../json/baseUserProfile.json')

router.get('/list', (req, res) => {
	let result = accountProfiles.map((item, index) => {
		let user = _.find(basicUsers,(baseItem,idx) => (item.userID === baseItem.userID))
		let newItem = Object.assign({},item,user)
		return newItem
	})
	res.send(result)
})

router.post('/add', (req, res) => {
	let result = null
	if (req.body.userData) {
		let userData = _.clone(req.body.userData)
		if(_.find(accountProfiles,(item) => (userData.userBasic.userID === item.userID))) {
			result = {status: false}
			console.log('repeat')
		} else {
			accountProfiles.push(userData.accountProfiles)
			basicUsers.push(userData.userBasic)
			result = {status: true}
		}
		
	} else {
		result = {status: false}
	}
	res.send(result)
})
/**
 * @apiGroup UserProfile
 * @api {GET} /userprofile/item user profile by user id
 * @apiDescription return user profile by user id
 * @apiExample {curl} Example usage:
 *		curl -i http://localhost/userprofile/item?userID=JC10001
 *
 * @apiParam {String} userID user id
 * @apiParamExample {json} Request-Example:
 * 		?userID=JC10001
 *
 * @apiSuccess (Success) {Object} user user basic infomation
 * @apiSuccess (Success) {String} user.id user index
 * @apiSuccess (Success) {String} user.firstName user firstName
 * @apiSuccess (Success) {String} user.lastName user lastName
 * @apiSuccess (Success) {String} user.displayName user displayName
 * @apiSuccess (Success) {String} user.userID user userID
 * @apiSuccess (Success) {String} user.userID user userID
 * @apiSuccess (Success) {String} user.staffID user staffID
 * @apiSuccess (Success) {String} user.phoneNumber user phoneNumber
 * @apiSuccess (Success) {String} user.emailAddress user emailAddress
 * @apiSuccess (Success) {String} user.homeAddress user homeAddress
 * @apiSuccess (Success) {Object} account user account infomation
 * @apiSuccess (Success) {String} account.id account index
 * @apiSuccess (Success) {String} account.displayName account displayName
 * @apiSuccess (Success) {String} account.status account status
 * @apiSuccess (Success) {Object[]} account.assignedUserRoles account assignedUserRoles
 * @apiSuccess (Success) {String} account.assignedUserRoles.assignedUserRole account assignedUserRole
 * @apiSuccess (Success) {String} account.activationDate account activationDate
 * @apiSuccess (Success) {String} account.deactivationDate account deactivationDate
 * @apiSuccess (Success) {String} account.userID account userID
 * @apiSuccessExample {json} Success-Response:
 *		HTTP/1.1 200 OK
 *		{
 *			"user": {
 *			  "id":"id001",
 *			  "firstName":"Bing",
 *			  "lastName":"Hu",
 *			  "displayName":"Bing Hu",
 *			  "userID":"JC10001",
 *			  "position":"Manager",
 *			  "staffID":"0000001",
 *			  "phoneNumber":"1380000001",
 *			  "emailAddress":"bing_hu@hkjc.com",
 *			  "homeAddress":"Flat 8, HKJC Building, Block 1 Jockey Road, Central, Hong Kong"
 *			},
 *			"account": {
 *			  "id": "0001",
 *			  "displayName": "Bing Hu",
 *			  "status": "Active",
 *			  "assignedUserRoles": [{
 *			    "assignedUserRole": "Trading User Administrator"
 *			  }, {
 *			    "assignedUserRole": "Trading Supervisor"
 *			  }],
 *			  "activationDate": "16/09/2016",
 *			  "deactivationDate": "16/09/2017",
 *			  "userID": "JC10001"
 *			}
 *		}
 *
 * @apiError (Error) {String} error  UserAccountNotFound
 * @apiErrorExample {json} Error-Response:
 *		HTTP/1.1 404 Not Found
 *		{
 *			"error": "UserAccountNotFound"
 *		}
 */
router.get('/item', (req, res) => {
	const userID = req.query.userID
	const result = UserProfileUtil.itemFilter(basicUsers, accountProfiles, userID)
	if (result === null) {
		res.status(404)
		res.send({'error': 'UserAccountNotFound'})
	} else {
		res.send(result)
	}
})

// router.post('/add', (req, res) => {
// 	let result = accountProfiles

// 	res.send(result)
// })

// router.post('/update', (req, res) => {
// 	let result = accountProfiles

// 	res.send(result)
// })

// router.post('/delete', (req, res) => {
// 	let result = accountProfiles

// 	res.send(result)
// })

export default router
