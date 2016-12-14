import express from 'express'
import UserProfileUtil from './userprofile-util'
import _ from 'lodash'
import UserProfileListUtil from './userprofilelist-util'

const router = express.Router()

const accountProfiles = require('../json/accountprofiles.json')
const basicUsers = require('../json/userProfile2.json')
const basicUserOutSide = require('../json/baseUserProfile.json')

router.post('/outsidedata', (req, res) => {
	let status = 200
	let result = ''
	let id = req.body.id || null
	if (!req.body.id) {
		result = basicUserOutSide
	} else {
		result = _.find(basicUserOutSide, item => item.id === id)
	}
	(!result) && (status = 404)
	res.status(status)
	res.send(result)
})

/**
 * @apiGroup UserProfile
 * @api {POST} /userprofile/list user profile list

 * @apiDescription Search criteria mock API in Audit log page.
 *
 * @apiSuccessExample Success response
 *		HTTP/1.1 200 OK
 *		{
 *			"auditlogs": [ ... ],
 *			"pageData": {pages: [ ... ], totalPages: 40 }
 *		}
 *
 *
 */
router.post('/list', (req, res) => {
	let allUser = accountProfiles.map((item, index) => {
		let user = _.find(basicUsers, (baseItem, idx) => (item.userID === baseItem.userID))
		let newItem = Object.assign({}, user, item)
		return newItem
	})

	var filteredResult = UserProfileListUtil.doFilter(
		allUser,
		req.body.keyword,
		req.body.position,
		req.body.userRole,
		req.body.accountStatus,
		req.body.dateTimeFrom,
		req.body.dateTimeTo
	)

	res.send(filteredResult)
})

router.post('/add', (req, res) => {
	let result = null
	if (req.body.userData) {
		let userData = _.clone(req.body.userData)
		if (_.find(accountProfiles, (item) => (userData.userBasic.userID === item.userID))) {
			result = {status: false}
		} else {
			accountProfiles.push(userData.accountProfiles)
			basicUsers.push(userData.userBasic)
			_.remove(basicUserOutSide, (item) => (userData.userBasic.userID === item.userID))
			result = {status: true}
		}
	} else {
		result = {status: false}
	}
	res.send(result)
})

// router.post('/delete', (req, res) => {
// 	let result = accountProfiles

// 	res.send(result)
// })

/**
 * @apiGroup UserProfile
 * @api {POST} /userprofile/item user profile by user id
 * @apiDescription return user profile by user id
 *
 * @apiParam {String} userID user id
 * @apiParamExample {json} Request-Example:
 * 		{
 * 			"userID": "JC10001"
 * 		}
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
router.post('/item', (req, res) => {
	const userID = req.body.userID
	const result = UserProfileUtil.itemFilter(basicUsers, accountProfiles, userID)
	if (result === null) {
		res.status(404)
		res.send({'error': 'UserAccountNotFound'})
	} else {
		res.send(result)
	}
})

router.post('/updateDelegation', (req, res) => {
	const userID = req.query.userID
	const userData = _.find(accountProfiles, (item) => (item.userID === userID))
	if (!userData) {
		res.status(404)
		res.send({status: false})
	} else {
		const oldDelegationList = userData.delegationList
		req.body.delegationList && req.body.delegationList.forEach((item, index) => {
			let oldRecordItem = _.find(oldDelegationList, (_item) => (_item.delegationID === item.delegationID))
			if (oldRecordItem) {
				_.remove(oldDelegationList, (_item) => (_item.delegationID === item.delegationID))
			}
			userData.delegationList.unshift(item)
			res.send({status: true})
		})
	}
})

router.get('/getDelegation', (req, res) => {
	let result = {}
	let departmentData = {}
	const userID = req.query.userID
	let departmentId = _.find(accountProfiles, (baseItem, idx) => (userID === baseItem.userID)).departmentId
	departmentData = _.filter(accountProfiles, (baseItem, idx) => (departmentId === baseItem.departmentId))

	result = _.filter(basicUsers, (baseItem, index) => {
		let isMyDepUser = false
		_.each(departmentData, (item, index) => {
			if (item.userID === baseItem.userID && baseItem.userID !== userID) {
				isMyDepUser = true
			}
		})
		return isMyDepUser
	})

	res.send(result)
})

/**
 * @apiGroup UserProfile
 * @api {POST} /userprofile/update update user profile by user id
 * @apiDescription update user profile by user id
 * @apiParam {String} userID user id
 * @apiParam {String} [displayName] display name
 * @apiParam {String} [status] status Active or Inactive
 * @apiParam {Object[]} [assignedUserRoles] user roles
 * @apiParam {String} [assignedUserRoles.assignedUserRole] some role
 * @apiParam {String} [activationDate] activation date
 * @apiParam {String} [deactivationDate] deactivation date
 * @apiParamExample {json} Request-Example:
 * 		{
 * 			"userID": "JC10001",
 * 			"displayName": "Bing Hu New",
 * 			"status": "Active",
 * 			"assignedUserRoles": [{"assignedUserRole": "Trading User Administrator"}],
 * 			"activationDate": "26/09/2016",
 * 			"deactivationDate": "26/09/2017",
 * 		}
 *
 * @apiSuccess (Success) {String} msg success message
 * @apiSuccessExample {json} Success-Response:
 *		HTTP/1.1 200 OK
 *		{
 *			"msg": "You have success updated you account information!"
 *		}
 *
 * @apiError (Error) {String} error  UserAccountNotFound
 * @apiErrorExample {json} Error-Response:
 *		HTTP/1.1 404 Not Found
 *		{
 *			"error": "The user you have updated is invalid."
 *		}
 */
router.post('/update', (req, res) => {
	const userID = req.body.userID
	const bUpdate = UserProfileUtil.itemUpdate(accountProfiles, userID, req.body)
	let result = {
		msg: 'You have success updated you account information!'
	}

	if (!bUpdate) {
		res.status(404)
		result = {
			error: 'The user you have updated is invalid.'
		}
	}

	res.send(result)
})

/**
 * @apiGroup UserProfile
 * @api {POST} /userprofile/deleteDelegation delete user delegation
 * @apiDescription delete user delegation
 * @apiParam {String} userID user id
 * @apiParam {String[]} delegationIds user delegation ids
 * @apiParamExample {json} Request-Example:
 * 		{
 * 			"userID": "JC10001",
 * 			"delegationIds": ["0001", "0002"]
 * 		}
 *
 * @apiSuccess (Success) {String} msg success message
 * @apiSuccessExample {json} Success-Response:
 *		HTTP/1.1 200 OK
 *		{
 *			"msg": "You have success delete the delegation!"
 *		}
 *
 * @apiError (Error) {String} error  UserAccountNotFound
 * @apiErrorExample {json} Error-Response:
 *		HTTP/1.1 404 Not Found
 *		{
 *			"error": "The user you have updated is invalid."
 *		}
 */
router.post('/deleteDelegation', (req, res) => {
	const userID = req.body.userID
	const bOk = UserProfileUtil.deleteDelegation(accountProfiles, userID, req.body)
	let result = {
		msg: 'You have success delete the delegation!'
	}

	if (!bOk) {
		res.status(404)
		result = {
			error: 'The user you have updated is invalid.'
		}
	}

	res.send(result)
})

export default router
