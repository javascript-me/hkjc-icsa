import React, { PropTypes } from 'react'
import Autosuggest from 'react-autosuggest/dist'

export default class AutoComplete extends React.Component {
	constructor (props) {
		super(props)

		this.onChange = this.onChange.bind(this)
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
		this.onSuggestionSelected = this.onSuggestionSelected.bind(this)

		this.lastResult = {value: '', items: []}
		this.state = {
			value: '',
			suggestions: [],
			inputClassName: props.className,
			noSuggestions: false
		}
	}

	onChange (event, {newValue}) {
		this.setState({
			selectedItem: null,
			value: newValue
		})
	}

	onSuggestionSelected (event, {suggestion}) {
		this.setState({selectedItem: suggestion, noSuggestions: false})
		this.props.onItemSelected(suggestion)
	}

	async onSuggestionsFetchRequested ({ value }) {
		if (this.lastResult.value === value) return this.lastResult.items

		let items = await this.props.onItemsRequested(value)

		items = items.slice(0, this.props.maxResults)
		this.lastResult = {value, items}

		this.setState({
			suggestions: items,
			noSuggestions: !items.length
		})
	}

	onSuggestionsClearRequested () {
		this.lastResult = {value: '', suggestions: []}
		this.setState({
			suggestions: [],
			noSuggestions: false
		})
	}

	render () {
		const inputProps = {
			placeholder: this.props.placeholder,
			value: this.state.value,
			onChange: this.onChange,
			className: this.state.inputClassName
		}

		return (
			<div>
				<Autosuggest
					suggestions={this.state.suggestions}
					onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
					onSuggestionsClearRequested={this.onSuggestionsClearRequested}
					onSuggestionSelected={this.onSuggestionSelected}
					getSuggestionValue={item => item.text}
					renderSuggestion={s => <span className={this.props.itemClassName}>{s.text}</span>}
					inputProps={inputProps}
					renderInputComponent={(inputProps) => <input {...inputProps} />}
				/>
				{ this.state.noSuggestions &&
					<div className='no-suggestions-container'>
						<div className={this.props.itemClassName + ' no-suggestions'}>{this.props.noSuggestionsText}</div>
					</div>
				}
			</div>
    )
	}
}

AutoComplete.propTypes = {
		/**
		 * Will be called whenever a item from the autocompletion list is selected either by mouse click or keyboard Enter hit
		 */
	onItemSelected: PropTypes.func.isRequired,
		/**
		 * NOTE: async!
		 *
		 * Will be called whenever items for autocompletion are needed (e.g. when input text changes).
		 * Expects an array of objects {value,text} as the result
		 */
	onItemsRequested: PropTypes.func.isRequired,
		/**
		 * Text to display in the input field
		 */
	placeholder: PropTypes.string,
		/**
		 * Css class for an autocomplete list item
		 */
	itemClassName: PropTypes.string,
	className: PropTypes.string,
		/**
		 * Text to display when there're no matching autocompletion items found (onItemsRequested returned [])
		 */
	noSuggestionsText: PropTypes.string,
		/**
		 * Maximum number of autocompletion items to display
		 */
	maxResults: PropTypes.number
}

AutoComplete.defaultProps = {
	placeholder: 'Search',
	noSuggestionsText: 'No Results',
	maxResults: 10
}
