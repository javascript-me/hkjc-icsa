import EventDirectoryUtil from './event-directory-util'
const football = require('../json/eventdirectory/football.json').events

it('footballAllKeyWord', () => {
	let result

	result = EventDirectoryUtil.footballAllKeyWord(football)
	expect(result.length > 0).to.be.true
})

it('footballFilter', () => {
	let result

	result = EventDirectoryUtil.footballFilter(football, {
		keyword: '',
		eventType: '',
		from: '',
		to: ''
	})
	expect(result.match === 'None').to.be.true
	expect(result.data.length > 0).to.be.true

	result = EventDirectoryUtil.footballFilter(football, {
		keyword: 'England',
		eventType: '',
		from: '',
		to: ''
	})
	expect(result.match === 'L1').to.be.true

	result = EventDirectoryUtil.footballFilter(football, {
		keyword: 'Cup',
		eventType: '',
		from: '',
		to: ''
	})
	expect(result.match === 'L2').to.be.true

	result = EventDirectoryUtil.footballFilter(football, {
		keyword: 'ASV',
		eventType: '',
		from: '',
		to: ''
	})
	expect(result.match === 'L3').to.be.true

	result = EventDirectoryUtil.footballFilter(football, {
		keyword: 'xxxxxxxxxxxxxxxyyyyyyyyyyyyyyyyyyyyy',
		eventType: '',
		from: '',
		to: ''
	})
	expect(result.match === 'None').to.be.true
	expect(result.data.length === 0).to.be.true

	result = EventDirectoryUtil.footballFilter(football, {
		// keyword: '',
		eventType: 'Assigned,In-Play,Pre-Event,Prelim,Defined,Major',
		competition: '',
		from: '',
		to: ''
	})
	expect(result.data.length > 0).to.be.true
})

