import express from 'express'
const router = express.Router()

const auditlogs = require('./json/auditlogs.json')

/**
 * @api {GET} /auditlogs/auditlog auditlog
 * @apiGroup Auditlogs

 * @apiDescription Auditlogs' password authentication.
 *
 * @apiParam {String} searchText.
 * @apiParam {String} filter1.
 * @apiParam {String} filter2.
 *
 */
router.post('/filterAuditlogs', (req, res) => {
	const searchText = ""; // Write parameter according
	const filtersArray = ""; // Write filters array accordingly
	const pageNumber = ""; // Write accordingly
	let status = 403
	let result = { error: "Sorry we could not find auditlog with this search criteria", data: [searchText, filtersArray, pageNumber] }

	/*Search and Filter code will go here*/
})

export default router
