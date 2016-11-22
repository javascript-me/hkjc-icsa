function handleARS(list, keyword) {

    list.forEach(function (item) {
        item.children.forEach(function (child) {
            child.competitions = child.competitions.filter(function (element) {
                return element.t1.toLowerCase() === keyword.toLowerCase() || element.t2.toLowerCase() === keyword.toLowerCase()
            })
        })
    })

    return list
}

function doFilter(eventdirectory, keyword) {

    if (keyword === '') {
        return eventdirectory.ALL
    } else 	if (keyword === 'Premier' || keyword === 'Premier League') {
        return eventdirectory.Premier
    } else 	if (keyword === 'ARS') {
        return handleARS(eventdirectory.ARS.slice(0), keyword);
    }

    return []
}

export default {
    doFilter: doFilter
}