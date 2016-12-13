=== Pagination ===

By default the Pagination component use these default values:

sizePerPage: 10, // Rows to show per page
pageStartIndex: 1, // Page selected by default
showMinimalView: true, // Use the pagination style for HKJC , if it's false It will use the normal pagination with ' << < 1 2 3 > >> '
hideDisable: false // Hide the elements that are disable, for example if it's the first page the First and preview page should be disable by default they are shown.


=== Example ===

<PaginationList
	ref='pagination'
	currPage={this.state.currPage}
	changePage={this.handlePaginationData.bind(this)}
	sizePerPage={this.state.sizePerPage}
	sizePerPageList={options.sizePerPageList || Const.SIZE_PER_PAGE_LIST}
	pageStartIndex={options.pageStartIndex}
	paginationShowsTotal={options.paginationShowsTotal}
	paginationSize={options.paginationSize || Const.PAGINATION_SIZE}
	remote={this.isRemoteDataSource()}
	dataSize={dataSize}
	onSizePerPageList={options.onSizePerPageList}
	prePage={options.prePage || Const.PRE_PAGE}
	nextPage={options.nextPage || Const.NEXT_PAGE}
	firstPage={options.firstPage || Const.FIRST_PAGE}
	lastPage={options.lastPage || Const.LAST_PAGE}
	hideSizePerPage={options.hideSizePerPage}
	paginationClassContainer={options.paginationClassContainer}
	showMinimalView={options.showMinimalView} 
	hideDisable={options.hideDisable} />