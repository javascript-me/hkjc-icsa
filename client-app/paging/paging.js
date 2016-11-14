import React from 'react'
import PagingService from './paging-service'

export default React.createClass({

    currentSelectedPageNumber: 1,

    getInitialState () {
        return PagingService.getDataByPageNumber(1)
    },

    getUserSelectedPageNumber (currentSelectedPageNumber, innerText, totalPages) {

        var value = Number(innerText)

        if (!isNaN(value)) {
            return value
        }

        if (innerText == "<") {
            if (currentSelectedPageNumber > 1) {
                return currentSelectedPageNumber - 1
            }
        }

        if (innerText == ">") {
            if (currentSelectedPageNumber < totalPages) {
                return currentSelectedPageNumber + 1
            }
        }

        return currentSelectedPageNumber
    },

    onItemClick (event) {
        this.currentSelectedPageNumber = this.getUserSelectedPageNumber(
            this.currentSelectedPageNumber,
            event.target.innerText,
            this.state.totalPages
        )

        var data = PagingService.getDataByPageNumber(this.currentSelectedPageNumber)
        this.setState(data)
    },

    getClassName (page) {
        var result = []
        if (page.selected) result.push("selected")
        if (page.hasHandCursor) result.push("has-hand-cursor")
        if (page.greyOut) result.push("grey-out")
        return result.join(" ")
    },

    render() {
        return (
            <div className="paging">
                <ul>
                    {
                        this.state.pages.map(
                            function(page, i) {
                                return <li key={i} className={this.getClassName(page)} onClick={this.onItemClick}>{page.label}</li>
                            }.bind(this)
                        )
                    }
                </ul>
            </div>
        )
    }
})