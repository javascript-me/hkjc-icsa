import React from 'react'

class ContextMenu extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			isVisible: false
		}

		this.handleClick = this.handleClick.bind(this)
		this.handleItemClick = this.handleItemClick.bind(this)
	}

	handleClick () {
		this.hideMenu()
	}

	handleItemClick ({item}) {
		if (this.state.onItemSelected) {
			this.state.onItemSelected(item)
		}
		this.hideMenu()
	}

	/**
	 * Shows a context-menu with specified options
	 * @param options
	 * @param {[object]} options.items               Array of items to display
	 * @param {[object]} options.position            Context menu absolute position
	 * @param {number}   options.position.left
	 * @param {number}   options.position.top
	 * @param {number}   [options.className]         Custom css class of the menu
	 * @param {function} [options.onItemSelected]    Optional callback to invoke when an item is clicked
	 * @param {function} [options.renderItem]        Optional render function, accepts an item render
	 * @param {object}   [options.element]           DOM element the context menu is shown for
	 */
	show (options) {
		this.hideMenu()

		document.addEventListener('click', this.handleClick)

		this.setState({
			isVisible: true,
			items: options.items,
			className: options.className,
			position: options.position,
			onItemSelected: options.onItemSelected,
			renderItem: options.renderItem,
			element: options.element
		})
	}

	hideMenu () {
		if (this.state.isVisible) {
			$(this.state.element).removeClass('context-menu-target')
			document.removeEventListener('click', this.handleClick)
			this.setState({isVisible: false})
		}
	}

	render () {
		if (!this.state.isVisible) return <div />

		let items = this.state.items.map((item, index) => {
			return (
				<li className='context-menu-item' onClick={(event) => this.handleItemClick({event, item})} key={index}>
					{this.state.renderItem ? this.state.renderItem(item) : <span>item</span>}
				</li>
			)
		})

		$(this.state.element).addClass('context-menu-target')
		return (
			<ul className={`context-menu ${this.state.className || ''}`} style={this.state.position}>
				{items}
			</ul>
		)
	}
}

export default ContextMenu
