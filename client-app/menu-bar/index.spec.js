import React from 'react'
import { shallow } from 'enzyme'

import MenuBar, { SecondLevelMenu, ThirdLevelMenu, ThirdLevelOnly } from './index.js'
import menuBarData from './menuBarData'

describe('<MenuBar />', () => {
	it('renders system menu bar', () => {
		const menuBar = shallow(<MenuBar />)
		const firstLevelLength = menuBarData.menuList2.length
		expect(menuBar.find('div.menu-unit')).to.have.length(firstLevelLength)
	})

	it('renders Second-level-menu', () => {
		const secondLevelMenu = shallow(<SecondLevelMenu dataList={menuBarData.menuList1[1].subMenu} />)
		const secondLevelLength = menuBarData.menuList1[1].subMenu.length
		expect(secondLevelMenu.find('div.second-level-item')).to.have.length(secondLevelLength)
	})

	it('renders third-level-only-menu', () => {
		const thirdLevelOnly = shallow(<ThirdLevelOnly dataList={menuBarData.menuList1[1].subMenu[0].subMenu} />)
		let thirdLevelLength = menuBarData.menuList1[1].subMenu[0].subMenu.length
		for(let thirdMenuItem of  menuBarData.menuList1[1].subMenu[0].subMenu){
			if(thirdMenuItem.subMenu){
				thirdLevelLength = 0
			}
		}
		expect(thirdLevelOnly.find('div.third-level-item')).to.have.length(thirdLevelLength)
	})

	it('renders third-level-menu', () => {
		const thirdLevelMenu = shallow(<ThirdLevelMenu data={menuBarData.menuList1[1].subMenu[0].subMenu} />)
		let thirdLevelLength = menuBarData.menuList1[1].subMenu[0].subMenu.length
		let forthLevelFlag = false
		for(let thirdMenuItem of  menuBarData.menuList1[1].subMenu[0].subMenu){
			if(thirdMenuItem.subMenu){
				forthLevelFlag = true
			}
		}
		if(!forthLevelFlag){
			thirdLevelLength = 0
		}
		expect(thirdLevelMenu.find('div.third-level-item')).to.have.length(thirdLevelLength)
	})
})
