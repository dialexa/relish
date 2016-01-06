'use strict'
// from https://github.com/hapijs/joi/blob/master/generate-readme-toc.js

const Toc = require('markdown-toc')
const Fs = require('fs')
const Package = require('./package.json')

const internals = {
  filename: './API.md'
}

internals.generate = function () {
  const api = Fs.readFileSync(internals.filename, 'utf8')
  const tocOptions = {
    bullets: '-',
    slugify: function (text) {
      return text.toLowerCase()
        .replace(/\s/g, '-')
        .replace(/[^\w-]/g, '')
    }
  }

  const output = Toc.insert(api, tocOptions)
    .replace(/<!-- version -->(.|\n)*<!-- versionstop -->/, '<!-- version -->\nAPI Documentation - `v' + Package.version + '`\n---\n<!-- versionstop -->')

  Fs.writeFileSync(internals.filename, output)
}

internals.generate()
