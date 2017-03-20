import marked from 'marked';

var renderer = new marked.Renderer()

renderer.blockquote = (quote) => {
  return '<div class="ui info message">' + quote + '</div>'
}

export default renderer