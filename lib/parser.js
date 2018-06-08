/**
 * Module dependencies.
 */
var showdown = require('showdown');
var marked   = require('./marked');
var unified = require('unified');
var parse = require('remark-parse');
var remarkToRehype = require('remark-rehype');
var stringify = require('rehype-stringify');
var R        = require('./global');
var kramed = require('kramed')

// markup-it
const { State } = require('markup-it');
const markit_markdown = require('markup-it/lib/markdown');
const markit_html = require('markup-it/lib/html');


// marked
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

kramed.setOptions({
  renderer: new kramed.Renderer(),
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

/**
 * Markdown parser with showdown.
 *
 * @param {String} input
 * @api public
 */

exports.parse = function(input) {

  var parser =  R.get("parser");

  var html = null;
  if ( parser === "showdown" ) {
    html = converter.makeHtml(input);
  } else if ( parser === "remark" ) {
    html = remark.process(input).contents;
  } else if (parser === "marked") {
    html = marked(input); // default
    html =  html
      .replace(/equation\_/g, "equation*")
      .replace(/<pre><code>\$\$/g, '$$$$')
      .replace(/\$\$<\/code><\/pre>/g, '$$$$');
  } else if (parser === 'markup-it') {
    console.log("markup-it");
    const markit_md_state = State.create(markit_markdown);
    const markit_html_state = State.create(markit_html);
    var doc = markit_md_state.deserializeToDocument(input);
    html = markit_html_state.serializeDocument(doc);
  } else {
    html = kramed(input);
  }
  return html;
};
