import React from 'react'
import AuditlogStore from '../auditlog/auditlog-store';

export default React.createClass({

    currentSelectedPageNumber: -1,

    getInitialState () {
        var defaultSelectedPageNumber = 1
        this.currentSelectedPageNumber = defaultSelectedPageNumber
        AuditlogStore.getDataByPageNumber(defaultSelectedPageNumber)

        return {
            pages: [],
            totalPages: 0
        }
    },

    componentDidMount() {
        AuditlogStore.addChangeListener(this._onChange.bind(this));
    },

    componentWillUnmount() {
        AuditlogStore.removeChangeListener(this._onChange.bind(this));
    },

    _onChange() {
        this.setState(AuditlogStore.pageData);
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
        AuditlogStore.getDataByPageNumber(this.currentSelectedPageNumber)
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