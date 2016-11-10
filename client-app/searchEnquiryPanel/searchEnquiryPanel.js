import React from 'react'
import DateTime from '../dateTime/dateTime'

export default class SearchEnquiryPanel extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      verify : '1'
    }
  }

  handleSubmit () {
    let fieldTFromLength = $('input[for=dateTimeFrom]').val().replace(/^[\s]*$/, "").length;
    let fieldTToLength = $('input[for=dateTimeTo]').val().replace(/^[\s]*$/, "").length;
    const { verify } = this.state.verify;
    if (fieldTFromLength === 0 || fieldTToLength === 0){
      this.setState({
        verify : '2'
      });
    } else {
      console.log('true');
    }
  }

  tipsTextRender () {
    const verify = this.state.verify;
    if (verify === '1') {
      return <span className="color-blue">* These fields are mandatory</span>;
    } else if (verify === '2') {
      return <span className="color-red">* Invalid fields are highlighted in red</span>;
    }
  }

  render () {
    return <div className="component-searchEnquiryPanel" style={{'margin': '50px'}}>
      <div className="container-fluid pd-w10">
        <div className="row mg-w010">
          <div className="col-sm-3 pd-w10">
            <DateTimeBlock inputFor="dateTimeFrom" inputText="Date Time From" isMandatory="true" />
          </div>
          <div className="col-sm-3 pd-w10">
            <DateTimeBlock inputFor="dateTimeTo" inputText="Date Time To" isMandatory="true" />
          </div>
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>Type</label>
              <select className="form-control">
                <option>All</option>
                <option>Test01</option>
                <option>Test02</option>
                <option>Test03</option>
              </select>
            </div>
          </div>
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>Back End ID</label>
              <input type="text" className="form-control" placeholder="Type in keyword" />
            </div>
          </div>
        </div>
        <div className="row mg-w010">
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>Front End ID</label>
              <input type="text" className="form-control" placeholder="Type in keyword" />
            </div>
          </div>
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>Event Lv1</label>
              <input type="text" className="form-control" placeholder="Type in keyword" />
            </div>
          </div>
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>Home</label>
              <input type="text" className="form-control" placeholder="Type in keyword" />
            </div>
          </div>
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>Away</label>
              <input type="text" className="form-control" placeholder="Type in keyword" />
            </div>
          </div>
        </div>
        <div className="row mg-w010">
          <div className="col-sm-3 pd-w10">
            <DateTimeBlock inputFor="dateTimeGameStart" inputText="K.O Time/Game Start Game" isMandatory="false" />
          </div>
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>User ID</label>
              <input type="text" className="form-control" placeholder="Type in keyword" />
            </div>
          </div>
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>User Role</label>
              <select className="form-control">
                <option>All</option>
                <option>Test01</option>
                <option>Test02</option>
                <option>Test03</option>
              </select>
            </div>
          </div>
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>System Function</label>
              <select className="form-control">
                <option>All</option>
                <option>Test01</option>
                <option>Test02</option>
                <option>Test03</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row mg-w010">
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>Bet Type/Feature</label>
              <select className="form-control">
                <option>All</option>
                <option>Test01</option>
                <option>Test02</option>
                <option>Test03</option>
              </select>
            </div>
          </div>
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>Device</label>
              <select className="form-control">
                <option>All</option>
                <option>Test01</option>
                <option>Test02</option>
                <option>Test03</option>
              </select>
            </div>
          </div>
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>IP Address</label>
              <input type="text" className="form-control" placeholder="Type in keyword" />
            </div>
          </div>
          <div className="col-sm-3 pd-w10">
            <div className="form-group">
              <label>Error Code</label>
              <input type="text" className="form-control" placeholder="Type in keyword" />
            </div>
          </div>
        </div>
        <div className="pannel-footer">
          <div className="item-text">{this.tipsTextRender()}</div>
          <div className="item-after">
            <button type="button" className="btn btn-link">Reset</button>
            <button type="button" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Search</button>
          </div>
        </div>
      </div>
    </div>;
  }
}


class DateTimeBlock extends React.Component {
  render () {
    return <div className="form-group">
      <label>{this.props.inputText} {this.props.isMandatory === "true" ? <span>*</span> : ''}</label>
      <DateTime inputFor={this.props.inputFor} />
    </div>;
  }
}
