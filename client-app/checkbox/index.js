import React, { Component, PropTypes } from 'react';

class Checkbox extends Component {
  componentDidMount() { this.update(this.props.checked); }
  componentWillReceiveProps(props) { this.update(props.checked); }
  update(checked) {
    ReactDOM.findDOMNode(this).indeterminate = checked === 'indeterminate';
  }
  render() {
    return (
      <input className='react-bs-select-all {...this.props.classInput}'
        type='checkbox'
        checked={ this.props.checked }
        onChange={ this.props.onChange } />
    );
  }
}

Checkbox.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  classInput: PropTypes.number
};

export default Checkbox