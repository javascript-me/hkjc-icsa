import React from 'react'
import ExportService from '../auditlog/export-service'
import Popup from '../popup'
import ExportPopup from '../exportPopup'

const doExport = async (format, filters) => {
	const file = ExportService.getNoticeboardFileURL(format, filters)
	if (file) {
		window.open(file, '_blank')
	}
}
export default React.createClass({
	propTypes: {
		someThing: React.PropTypes.bool
	},

	getInitialState () {
		return {
			data: [],
			pageTitle: 'Home \\ Global Tools & Adminstration \\ Communication \\ Noticeboard',
			exportFormat: 'pdf'
		}
	},
	componentDidMount: function async() {
	},
	openPopup () {
		this.setState({ exportFormat: 'pdf' })// reset the format value
		this.refs.exportPopup.show()
	},

	export () {
		const filters ={ username: "allgood", selectedPageNumber: 1, sortingObjectFieldName: "date_time", sortingObjectOrder: "DESCEND", betType: "football", keyword: "", dateTimeFrom: "09 Oct 2016 00:00", dateTimeTo: "08 Dec 2016 23:59" }
		doExport(this.state.exportFormat, filters)
		},

	onChangeFormat (format) {
		this.setState({ exportFormat: format })
	},



	render () {
		return (


			<div className='conatainer-alert '>
				<div className='row page-header'>
					<p className='hkjc-breadcrumb'>{this.state.pageTitle}</p>
					<h1>Noticeboard</h1>
				</div>
				<div className='row page-content'>
					{/* Search Critiria Row */}
					<div className='col-md-12'>
						<div className='search-criteria-container'>
							{/*Filters will Go here...*/}
						</div>
					</div>
				</div>
				<div>
					<div className='table-container '>
						{/*Table component will go here...*/}
					</div>
					<div className='vertical-gap'>
						<div className='pull-right'>
							<button className='btn btn-primary pull-right' onClick={this.openPopup}>Export</button>
							<Popup hideOnOverlayClicked ref='exportPopup' title='Audit Trail Export' onConfirm={this.export} >
								<ExportPopup onChange={this.onChangeFormat} />
							</Popup>
							{/*Export popup will go here...*/}
						</div>
					</div>
				</div>
			</div>

		)
	}
})
