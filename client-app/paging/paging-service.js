export default {

    totalPages: 150,

    createPageListByRange (pages, selectedPageNumber, range) {
        for (var i = range.startIndex ; i <= range.endIndex ; i++) {
            var selected = (selectedPageNumber == i) ? true : false
            pages.push({label: i, selected: selected, hasHandCursor: true, greyOut: false})
        }
    },

    setLeftHandSideSymbol (selectedPageNumber, pages) {
        if (5 < selectedPageNumber) {
            pages.push({label: 1, selected: false, hasHandCursor: true, greyOut: false})
            pages.push({label: "...", selected: false, hasHandCursor: false, greyOut: false})
        }
    },

    setRightHandSideSymbol (selectedPageNumber, pages) {
        if (selectedPageNumber < this.totalPages - 4) {
            pages.push({label: "...", selected: false, hasHandCursor: false, greyOut: false})
            pages.push({label: this.totalPages, selected: false, hasHandCursor: true, greyOut: false})
        }
    },

    fixInvalidSelectedPageNumber: function (selectedPageNumber) {
        if (selectedPageNumber > this.totalPages) {
            selectedPageNumber = this.totalPages
        }

        if (selectedPageNumber < 1) {
            selectedPageNumber = 1
        }
        return selectedPageNumber;
    },

    getDataByPageNumber (selectedPageNumber) {

        if (isNaN(selectedPageNumber)) {
            return {
                pages: [],
                totalPages: this.totalPages
            }
        }

        selectedPageNumber = this.fixInvalidSelectedPageNumber(selectedPageNumber);

        var pages = []

        pages.push({label:"<", selected:false, hasHandCursor:(selectedPageNumber == 1) ? false : true, greyOut:(selectedPageNumber == 1) ? true : false})

        this.setLeftHandSideSymbol(selectedPageNumber, pages);

        if (1 <= selectedPageNumber && selectedPageNumber <= 5) {
            this.createPageListByRange(pages, selectedPageNumber, {startIndex: 1, endIndex: 6})
        }

        if (5 < selectedPageNumber && selectedPageNumber < this.totalPages - 4) {
            this.createPageListByRange(pages, selectedPageNumber, {startIndex: selectedPageNumber - 2, endIndex: selectedPageNumber + 2})
        }

        if (this.totalPages - 4 <= selectedPageNumber && selectedPageNumber <= this.totalPages) {
            this.createPageListByRange(pages, selectedPageNumber, {startIndex: this.totalPages - 5, endIndex: this.totalPages})
        }

        this.setRightHandSideSymbol(selectedPageNumber, pages);

        pages.push({label:">", selected:false, hasHandCursor:(selectedPageNumber == this.totalPages) ? false : false, greyOut:(selectedPageNumber == this.totalPages) ? true : false})

        return {
            pages: pages,
            totalPages: this.totalPages
        }
    }

}
