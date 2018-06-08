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
  renderer:    new marked.Renderer(),
  gfm:         true,
  tables:      true,
  breaks:      false,
  pedantic:    false,
  sanitize:    true,
  smartLists:  true,
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

/**
 * Markdown parser with showdown.
 *
 * @param {String} input
 * @api public
 */

exports.parse = function(input) {

  var jax = mathjax()
  var parser =  R.get("parser");

  var html = null;

  if ( parser === "showdown" ) {
    html = converter.makeHtml(input);
  } else if ( parser === "remark" ) {
    html = remark.process(input).contents;
  } else {
    html = marked(input); // default
    console.log("Using marked");
  }
  return jax.detokenize(html);
};
