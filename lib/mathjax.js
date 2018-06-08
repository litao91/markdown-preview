var delimiters = new RegExp([
  /\$\$[^`][\s\S]+?\$\$/,
  /\\\([^`][\s\S]+?\\\)/,
  /\\\[[^`][\s\S]+?\\\]/,
  /\\begin\{.*?\}[^`][\s\S]+?\\end\{.*?\}/,
  /\$[^$`].+?\$/,
]
.map((regex) => `(?:${regex.source})`).join('|'), 'gi')

var escape = (math) =>
  math.replace(/[<>&]/gi, (symbol) =>
    symbol === '>' ? '&gt;' :
    symbol === '<' ? '&lt;' :
    symbol === '&' ? '&amp;': null
  )

var ctor = (map = {}) => ({
  tokenize: (markdown) =>
    markdown.replace(delimiters, (str, offset) => (
      map[offset] = str,
      `?${offset}?`
    ))
  ,
  detokenize: (html) =>
    Object.keys(map)
      .reduce((html, offset) =>
        html = html.replace(`?${offset}?`, () => escape(map[offset])),
        html
      )
})
module.exports = Object.assign(ctor, {delimiters, escape})