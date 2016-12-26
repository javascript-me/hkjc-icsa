import config from '../config'
import {PopupService} from '../popup'

const urls = {
	ACTIONS_LIST: 'api/actions/list'
}

const TYPE_GET = 0
const TYPE_POST = 1

const doGet = (url, param) => {
	return $.get(config.url(url), param)
}

const doPost = (url, param) => {
	return $.post(config.url(url), param)
}

const asyncAjax = async (type, url, param) => {
	let ajaxFun = doGet
	if (TYPE_POST === type) ajaxFun = doPost

	let result = {
		error: null,
		data: null
	}

	try {
		result.data = await ajaxFun(url, param)
	} catch (error) {
		result.error = error
		PopupService.showSuggestBox('warnning', error.responseText || error.statusText)
	}

	return result
}

export default {
	urls: urls,

	getData (url, param) {
		return asyncAjax(TYPE_GET, url, param)
	},

	postData (url, param) {
		return asyncAjax(TYPE_POST, url, param)
	}
}
