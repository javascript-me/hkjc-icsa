import React, { Component, PropTypes } from 'react'
import Const from './Const'
import TableRow from './TableRow'
import TableColumn from './TableColumn'
import TableEditColumn from './TableEditColumn'
import classSet from 'classnames'
import ExpandComponent from './ExpandComponent'

const isFun = function (obj) {
	return obj && (typeof obj === 'function')
}

class TableBody extends Component {
	constructor (props) {
		super(props)
		this.state = {
			currEditCell: null,
			expanding: [],
			lastExpand: null
		}
	}

	render () {
		const { cellEdit } = this.props
		const tableClasses = classSet('table', {
			'table-striped': this.props.striped,
			'table-bordered': this.props.bordered,
			'table-hover': this.props.hover,
			'table-condensed': this.props.condensed
		}, this.props.tableBodyClass)

		const noneditableRows = (cellEdit.nonEditableRows && cellEdit.nonEditableRows()) || []
		const unselectable = this.props.selectRow.unselectable || []
		const isSelectRowDefined = this._isSelectRowDefined()
		const tableHeader = this.renderTableHeader(isSelectRowDefined)
		const inputType = this.props.selectRow.mode === Const.ROW_SELECT_SINGLE ? 'radio' : 'checkbox'
		const CustomComponent = this.props.selectRow.customComponent

		const tableRows = this.props.data.map(function (data, r) {
			const tableColumns = this.props.columns.map(function (column, i) {
				const fieldValue = data[column.name]
				if (column.name !== this.props.keyField && // Key field can't be edit
					column.editable && // column is editable? default is true, user can set it false
					this.state.currEditCell !== null &&
					this.state.currEditCell.rid === r &&
					this.state.currEditCell.cid === i &&
					noneditableRows.indexOf(data[this.props.keyField]) === -1) {
					let editable = column.editable
					const format = column.format ? function (value) {
						return column.format(value, data, column.formatExtraData, r).replace(/<.*?>/g, '')
					} : false
					if (isFun(column.editable)) {
						editable = column.editable(fieldValue, data, r, i)
					}

					return (
						<TableEditColumn
							completeEdit={this.handleCompleteEditCell.bind(this)}
							// add by bluespring for column editor customize
							editable={editable}
							customEditor={column.customEditor}
							format={column.format ? format : false}
							key={i}
							blurToSave={cellEdit.blurToSave}
							rowIndex={r}
							colIndex={i}
							row={data}
							fieldValue={fieldValue}
						/>
					)
				} else {
					// add by bluespring for className customize
					let columnChild = fieldValue && fieldValue.toString()
					let columnTitle = null
					let tdClassName = column.className
					if (isFun(column.className)) {
						tdClassName = column.className(fieldValue, data, r, i)
					}

					if (typeof column.format !== 'undefined') {
						const formattedValue = column.format(fieldValue, data, column.formatExtraData, r)
						if (!React.isValidElement(formattedValue)) {
							columnChild = <div dangerouslySetInnerHTML={{ __html: formattedValue }} />
						} else {
							columnChild = formattedValue || this.props.nullValue
							columnTitle = column.columnTitle && formattedValue ? formattedValue : null
						}
					} else {
						columnTitle = column.columnTitle && fieldValue ? fieldValue : null
						columnChild = columnChild || this.props.nullValue
					}
					return (
						<TableColumn key={i}
							rIndex={r}
							dataAlign={column.align}
							className={tdClassName}
							columnTitle={columnTitle}
							cellEdit={cellEdit}
							hidden={column.hidden}
							onEdit={this.handleEditCell.bind(this)}
							width={column.width}>
							{ columnChild }
						</TableColumn>
					)
				}
			}, this)
			const key = data[this.props.keyField]
			const disable = unselectable.indexOf(key) !== -1
			const selected = this.props.selectedRowKeys.indexOf(key) !== -1
			const selectRowColumn = isSelectRowDefined && !this.props.selectRow.hideSelectColumn ? this.renderSelectRowColumn(selected, inputType, disable, CustomComponent, r) : null
			// add by bluespring for className customize
			let trClassName = this.props.trClassName
			if (isFun(this.props.trClassName)) {
				trClassName = this.props.trClassName(data, r)
			}
			// selectRow={isSelectRowDefined ? this.props.selectRow : undefined}
			const result = [ <TableRow isSelected={selected} key={key} className={trClassName}
				index={r}
				selectRow={this.props.selectRow}
				enableCellEdit={cellEdit.mode !== Const.CELL_EDIT_NONE}
				onRowClick={this.handleRowClick.bind(this)}
				onRowDoubleClick={this.handleRowDoubleClick.bind(this)}
				onRowMouseOver={this.handleRowMouseOver.bind(this)}
				onRowMouseOut={this.handleRowMouseOut.bind(this)}
				onSelectRow={this.handleSelectRow.bind(this)}
				unselectableRow={disable}>
				{ selectRowColumn }
				{ tableColumns }
			</TableRow> ]

			if (this.props.expandableRow && this.props.expandableRow(data)) {
				let colSpan = this.props.columns.length
				const bgColor = this.props.expandRowBgColor || this.props.selectRow.bgColor || undefined
				if (isSelectRowDefined && !this.props.selectRow.hideSelectColumn) {
					colSpan += 1
				}
				result.push(
					<ExpandComponent
						className={trClassName}
						bgColor={bgColor}
						hidden={!(this.state.expanding.indexOf(key) > -1)}
						colSpan={colSpan}
						width={'100%'}>
						{ this.props.expandComponent(data) }
					</ExpandComponent>
				)
			}
			return (result)
		}, this)
		if (tableRows.length === 0) {
			tableRows.push(
				<TableRow key='##table-empty##'>
					<td data-toggle='collapse'
						colSpan={this.props.columns.length + (isSelectRowDefined ? 1 : 0)}
						className='react-bs-table-no-data'>
						{ this.props.loading ? '' : (this.props.noDataText || Const.NO_DATA_TEXT) }
					</td>
				</TableRow>
			)
		}

		return (
			<div ref='container' className={classSet('react-bs-container-body',
				this.props.bodyContainerClass,
				{'loading': this.props.loading})}
				style={this.props.style}>
				<table className={tableClasses}>
					{ tableHeader }
					<tbody ref='tbody'>
						{ tableRows }
					</tbody>
				</table>
			</div>
		)
	}

	renderTableHeader (isSelectRowDefined) {
		let selectRowHeader = null

		if (isSelectRowDefined) {
			const style = {
				width: 91,
				minWidth: 91
			}
			if (!this.props.selectRow.hideSelectColumn) {
				selectRowHeader = (<col style={style} key={-1} />)
			}
		}
		const theader = this.props.columns.map((column, i) => {
			const style = {
				display: column.hidden ? 'none' : null
			}
			if (column.width) {
				const width = parseInt(column.width, 10)
				style.width = width
				/** add min-wdth to fix user assign column width not eq offsetWidth in large column table **/
				style.minWidth = width
			}
			return (<col style={style} key={i} className={column.className} />)
		})

		return (
			<colgroup ref='header'>
				{ selectRowHeader }{ theader }
			</colgroup>
		)
	}

	handleRowMouseOut (rowIndex, event) {
		const targetRow = this.props.data[rowIndex]
		this.props.onRowMouseOut(targetRow, event)
	}

	handleRowMouseOver (rowIndex, event) {
		const targetRow = this.props.data[rowIndex]
		this.props.onRowMouseOver(targetRow, event)
	}

	handleRowClick (rowIndex) {
		let selectedRow
		const { data, onRowClick } = this.props
		data.forEach((row, i) => {
			if (i === rowIndex - 1) {
				selectedRow = row
			}
		})
		const rowKey = selectedRow[this.props.keyField]
		if (this.props.expandableRow) {
			let expanding = this.state.expanding
			if (this.state.expanding.indexOf(rowKey) > -1) {
				expanding = expanding.filter(k => k !== rowKey)
			} else {
				expanding.push(rowKey)
			}
			this.setState({ expanding }, () => {
				this.props.adjustHeaderWidth()
			})
		}
		onRowClick(selectedRow)
	}

	handleRowDoubleClick (rowIndex) {
		let selectedRow
		const { data, onRowDoubleClick } = this.props
		data.forEach((row, i) => {
			if (i === rowIndex - 1) {
				selectedRow = row
			}
		})
		onRowDoubleClick(selectedRow)
	}

	handleSelectRow (rowIndex, isSelected, e) {
		let selectedRow
		const { data, onSelectRow } = this.props
		data.forEach((row, i) => {
			if (i === rowIndex - 1) {
				selectedRow = row
				return false
			}
		})
		onSelectRow(selectedRow, isSelected, e)
	}

	handleSelectRowColumChange (e, rowIndex) {
		if (!this.props.selectRow.clickToSelect || !this.props.selectRow.clickToSelectAndEditCell) {
			this.handleSelectRow(
				rowIndex + 1,
				e.currentTarget.checked,
				e
			)
		}
	}

	handleEditCell (rowIndex, columnIndex, e) {
		if (this._isSelectRowDefined()) {
			columnIndex--
			if (this.props.selectRow.hideSelectColumn) columnIndex++
		}
		rowIndex--
		const stateObj = {
			currEditCell: {
				rid: rowIndex,
				cid: columnIndex
			}
		}

		if (this.props.selectRow.clickToSelectAndEditCell && this.props.cellEdit.mode !== Const.CELL_EDIT_DBCLICK) {
			const selected = this.props.selectedRowKeys.indexOf(this.props.data[rowIndex][this.props.keyField]) !== -1
			this.handleSelectRow(rowIndex + 1, !selected, e)
		}
		this.setState(stateObj)
	}

	handleCompleteEditCell (newVal, rowIndex, columnIndex) {
		this.setState({ currEditCell: null })
		if (newVal !== null) {
			this.props.cellEdit.__onCompleteEdit__(newVal, rowIndex, columnIndex)
		}
	}

	renderSelectRowColumn (selected, inputType, disabled, CustomComponent = null, rowIndex = null) {
		let inputComp
		if (CustomComponent) {
			inputComp = <CustomComponent type={inputType} checked={selected} disabled={disabled} rowIndex={rowIndex} onChange={e => this.handleSelectRowColumChange(e, rowIndex)} />
		} else if (inputType === 'checkbox') {
			inputComp = <div className={classSet('input-check', {checked: selected, disabled})} onClick={(e) => { e.stopPropagation(); this.handleSelectRowColumChange({currentTarget: {checked: !selected}}, rowIndex) }} />
		} else {
			inputComp = <input type={inputType} checked={selected} disabled={disabled} onChange={e => this.handleSelectRowColumChange(e, rowIndex)} />
		}

		return (
			<TableColumn dataAlign='center' className='selectRowColumn'>
				{inputComp}
			</TableColumn>
		)
	}

	_isSelectRowDefined () {
		return this.props.selectRow.mode === Const.ROW_SELECT_SINGLE || this.props.selectRow.mode === Const.ROW_SELECT_MULTI
	}
}
TableBody.propTypes = {
	data: PropTypes.array,
	loading: PropTypes.bool,
	columns: PropTypes.array,
	striped: PropTypes.bool,
	bordered: PropTypes.bool,
	hover: PropTypes.bool,
	condensed: PropTypes.bool,
	keyField: PropTypes.string,
	selectedRowKeys: PropTypes.array,
	onRowClick: PropTypes.func,
	onRowDoubleClick: PropTypes.func,
	onSelectRow: PropTypes.func,
	noDataText: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
	style: PropTypes.object,
	tableBodyClass: PropTypes.string,
	bodyContainerClass: PropTypes.string,
	expandableRow: PropTypes.func,
	expandComponent: PropTypes.func,
	expandRowBgColor: PropTypes.string,
	adjustHeaderWidth: PropTypes.func,
	cellEdit: PropTypes.object,
	selectRow: PropTypes.object,
	trClassName: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]), // replace the propTypes.string
	onRowMouseOut: PropTypes.func,
	onRowMouseOver: PropTypes.func,
	nullValue: PropTypes.string
}
TableBody.defaultProps = {
	loading: false,
	nullValue: 'N/A'
}

export default TableBody
