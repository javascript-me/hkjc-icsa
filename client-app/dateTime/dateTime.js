import React from 'react'

export default class DateTime extends React.Component {
  render () {
    return <div className="form-group has-feedback date-time-compontent">
      <input type="text" htmlFor={this.props.inputFor} className="form-control" placeholder="Select Time" />
      <span className="icon icon-date form-control-feedback"></span>
    </div>;
  }
}
