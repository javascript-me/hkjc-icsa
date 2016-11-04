import 'babel-polyfill'
import 'isomorphic-fetch'
// Fix for jQuery and Bootstrap shim
// https://github.com/twbs/bootstrap/issues/17201
window.$ = window.jQuery = require('jquery')
const Bootstrap = require('bootstrap')
Bootstrap.$ = $
// End of fix

import render from './client-app'

const root = document.getElementById('root')
render(root)
