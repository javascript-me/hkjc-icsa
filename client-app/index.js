import 'babel-polyfill'
import 'isomorphic-fetch'
// Fix for jQuery and Bootstrap shim
// https://github.com/twbs/bootstrap/issues/17201
window.$ = window.jQuery = require('jquery')
const Bootstrap = require('bootstrap')
Bootstrap.$ = $
// End of fix
require('multiple-select')

import init from './client-app'

const root = document.getElementById('root')
init(root)
