import React, {Component} from 'react';

class MutiSelect extends Component {
	render() {
		return (
			<div className="muti-select-box">
				<div className="show-box">ccc</div>
				<div className="content">
					<div className="option">
						<input type="checkbox" />
						<span>dddd</span>
					</div>
					<div className="option">
						<input type="checkbox" />
						<span>dddd</span>
					</div>
					<div className="option">
						<input type="checkbox" />
						<span>dddd</span>
					</div>
				</div>
			</div>
		);
	}
}

class Page extends Component {
	render() {
		return (
			<div>
				<div>dddd</div>
				<MutiSelect style={{width:'100px'}}/>
			</div>
		);
	}
}
export default Page;