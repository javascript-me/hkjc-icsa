import React from 'react'
import { shallow } from 'enzyme'
import AutoComplete from './index'
import Autosuggest from 'react-autosuggest/dist'

describe('<AutoComplete />', () => {
	it('should initialize Autosuggest with correct properties', () => {
		const onItemsRequested = sinon.spy()
		const	onItemSelected = sinon.spy()
		const wrapper = shallow(<AutoComplete onItemSelected={onItemSelected} onItemsRequested={onItemsRequested} />)
		const instance = wrapper.instance()

		const autosuggest = wrapper.find(Autosuggest)
		expect(autosuggest.node.props.onSuggestionSelected).to.be.equal(instance.onSuggestionSelected)
		expect(autosuggest.node.props.onSuggestionsFetchRequested).to.be.equal(instance.onSuggestionsFetchRequested)
		expect(autosuggest.node.props.onSuggestionsClearRequested).to.be.equal(instance.onSuggestionsClearRequested)
	})
})
