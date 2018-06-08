/**
 * Module dependencies.
 */
var showdown = require('showdown');
var marked   = require('marked');
var unified = require('unified');
var parse = require('remark-parse');
var remarkToRehype = require('remark-rehype');
var stringify = require('rehype-stringify');
var R        = require('./global');
var mathjax = require('./mathjax');


marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false, // IMPORTANT, because we do MathJax before markdown,
                   //            however we do escaping in 'CreatePreview'.
  smartLists: true,
  smartypants: false
});

// Initialize a showdown coventer.
var converter = showdown.converter
  ? new showdown.converter()
  : new showdown.Converter();

// Initialize a remark coventer.
var remark = unified()
  .use(parse)
  .use(remarkToRehype)
  .use(stringify);

var escape = function (html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
   .replace(/'/g, '&#39;');
};

var jax = mathjax();

/**
 * Markdown parser with showdown.
 *
 * @param {String} input
 * @api public
 */

exports.parse = function(input) {

  var parser =  R.get("parser");

  var html = null;
  input = jax.detokenize(input);
  console.log(input);

  if ( parser === "showdown" ) {
    html = converter.makeHtml(input);
  } else if ( parser === "remark" ) {
    html = remark.process(input).contents;
  } else {
    html = marked(input); // default
    console.log("Using marked");
  }
  return html;
};
