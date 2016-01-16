'use strict'

const Toc = require('markdown-toc')
const Fs = require('fs')
const Package = require('./package.json')

const internals = {
  api: {
    filename: './API.md',
    contents: Fs.readFileSync('./API.md', 'utf8')
  },
  readme: {
    filename: './README.md',
    contents: Fs.readFileSync('./README.md', 'utf8')
  }
}

const tocOptions = {
  bullets: '-',
  slugify: function (text) {
    return text.toLowerCase()
      .replace(/\s/g, '-')
      .replace(/[^\w-]/g, '')
  }
}

// generate table of contents and version label docs
const api = Toc.insert(internals.api.contents, tocOptions)
  .replace(/<!-- version -->(.|\n)*<!-- versionstop -->/, `<!-- version -->\nAPI Documentation - \`v${Package.version}\`\n---\n<!-- versionstop -->`)
Fs.writeFileSync(internals.api.filename, api)

// create absolute URL for versioned docs
const readme = internals.readme.contents.replace(/\[API Documentation\]\(.*\)/g, `[API Documentation](${Package.homepage || ''}/blob/v${Package.version}/${internals.api.filename})`)
Fs.writeFileSync(internals.readme.filename, readme)
