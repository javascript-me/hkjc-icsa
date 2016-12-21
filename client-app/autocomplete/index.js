import React, { PropTypes } from 'react'
import Autosuggest from 'react-autosuggest/dist'

export default class AutoComplete extends React.Component {
    propTypes: {
        onItemSelected: PropTypes.func.isRequired,
        onItemsRequested: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
        itemClassName: PropTypes.string,
        noSuggestionsText: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.lastResult = {value: '', items: []};
        this.state = {
            value: '',
            suggestions: [],
            inputClassName: props.className,
            loading: false,
            noSuggestions: false
        };
    };

    onChange = (event, {newValue}) => {
        this.setState({
            selectedItem: null,
            value: newValue
        });
    };

    onSuggestionSelected = (event, {suggestion}) => {
        this.setState({selectedItem: suggestion, noSuggestions: false});
        this.props.onItemSelected(suggestion);
    };

    onSuggestionsFetchRequested = async ({ value }) => {
        if (this.lastResult.value === value) return this.lastResult.items;

        this.setState({loading: true});
        let items = await this.props.onItemsRequested(value);

        this.lastResult = {value, items};

        this.setState({
            loading: false,
            suggestions: items,
            noSuggestions: !items.length
        });
    };

    onSuggestionsClearRequested = () => {
        this.lastResult = {value: '', suggestions: []};
        this.setState({
            suggestions: [],
            noSuggestions: false
        });
    };

    render() {
        const inputProps = {
            placeholder: this.props.placeholder,
            value: this.state.value,
            onChange: this.onChange,
            className: this.state.inputClassName
        };

        return (
            <div>
                <Autosuggest
                    suggestions={this.state.suggestions || []}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected}
                    getSuggestionValue={item => item.text}
                    renderSuggestion={s => <span className={this.props.itemClassName}>{s.text}</span>}
                    inputProps={inputProps}
                    renderInputComponent={(inputProps) => <input {...inputProps} />}
                />
                { this.state.noSuggestions &&
                    <div className="no-suggestions-container">
                        <div className={this.props.itemClassName + " no-suggestions"}>{this.props.noSuggestionsText || 'No Results'}</div>
                    </div>
                }
            </div>
        );
    }
}