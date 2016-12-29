const allActions = require('../json/actions.json')
import ActionsUtil from './actions-util'

it('listFilter()', () => {
	var filteredResult

	filteredResult = ActionsUtil.listFilter(allActions, {
		userID: 'JC10001',
		keyWord: ''
	})
	expect(filteredResult.length > 0).to.be.true

	filteredResult = ActionsUtil.listFilter(allActions, {
		userID: 'JC10001',
		keyWord: 'complete'
	})
	expect(filteredResult.length > 0).to.be.true

	filteredResult = ActionsUtil.listFilter(allActions, {
		userID: 'JC10001',
		keyWord: 'xxxxyyyyyzzzzz'
	})
	expect(filteredResult.length === 0).to.be.true

	filteredResult = ActionsUtil.listFilter(allActions, {
		userID: 'JC10001',
		keyWord: 'xxxxyyyyyzzzzz',
		type: 'allTasks'
	})
	expect(filteredResult.length > 0).to.be.true
})
