import React, {Component} from 'react'
import Fetch from 'isomorphic-fetch'
import _ from 'lodash'

const FetchServerDataHoc = (FetchApi, mapDataToProps) => (Cmp) => {
	let { type, url, data } = FetchApi
	let getDataFunc
	type = type === 'post' ? 'post' : 'get'
	switch (type) {
	case ('post') : getDataFunc = Fetch(url, {method: 'POST', body: data}); break
	case ('get') : getDataFunc = () => Fetch(url); break
	default : break
	}
	return class HOC extends Component {
		constructor (props) {
			super(props)
			this.state = {
				data: null
			}
		}

		render () {
			let combineProps
			if (!mapDataToProps || typeof (mapDataToProps) !== 'function') {
				combineProps = Object.assign({}, this.props, {data: this.state.data})
			} else {
				combineProps = Object.assign({}, this.props, mapDataToProps(this.state.data))
			}
			return (<Cmp {...combineProps} />)
		}

		async componentWillMount () {
			getDataFunc()
			.then(res => res.json())
			.then((data) => { this.setState({data: data}) })
		}

		componentWillReceiveProps (nextProps) {
			if (!_.isEqual(nextProps, this.props)) {
				this.forceUpdate()
			}
		}

	}
}

export default FetchServerDataHoc
