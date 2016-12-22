import React from 'react'
import { shallow } from 'enzyme'
import SearchFilter from './searchfilter'

describe('<SearchFilter />', () => {
	it('SearchFilter render', () => {
		const filter = {
			scenario: {
				options: ['All', 'Assigned', 'In-Play', 'Archive', 'Today', 'Pre-Event', 'Prelim', 'Defined', 'Major'],
				default: 'Assigned'
			},
			competition: {
				options: ['All', 'Premier', 'FA Cup', 'League Cup', 'Championship'],
				default: 'All'
			}
		}

		const onSearch = sinon.spy();
		const wrapper = shallow(<SearchFilter filter={filter} onSearch={onSearch} />);
		const searchFilter = wrapper.instance();

		expect(wrapper.find('div.ed-filter')).to.have.length(1);

		const autoComplete = wrapper.find('AutoComplete');
		expect(autoComplete).to.be.not.null;
		expect(autoComplete.node.props.maxResults).to.be.equal(6);
		expect(autoComplete.node.props.placeholder).to.be.equal('Search');
		expect(autoComplete.node.props.noSuggestionsText).to.be.equal('No Results');
		expect(autoComplete.node.props.onItemSelected).to.be.equal(searchFilter.onSearchItemSelected);
		expect(autoComplete.node.props.onItemsRequested).to.be.equal(searchFilter.onSearchItemsRequested);

		// TODO: tests for the rest of functionality
	})
})
