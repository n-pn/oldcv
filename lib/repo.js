const fs = require('fs')
const path = require('path')

const Lookup = require('./dictdb/lookup')
const Commit = require('./dictdb/commit')

class DictDB {
  constructor(dirs) {
    this.dirs = dirs
    this.system = { common: {}, system: {}, unique: {} }
    this.commits = { common: {}, system: {}, unique: {} }
  }

  preload(repo) {
    const files = fs.readdirSync(this.dirs[repo])
    for (let file of files) {
      if (path.extname(file) !== '.txt') continue
      const name = path.basename(file, '.txt')
      this.get_lookup(repo, name)
    }
    return this.system[repo]
  }

  unique(udict = null) {
    if (!udict) return this.get_lookup('common', 'combine')
    return this.get_lookup('unique', udict)
  }

  get_lookup(repo, name) {
    let dict = this.system[repo][name]
    if (dict) return dict

    const file = path.join(this.dirs[repo], name + '.txt')
    dict = new Lookup(file)

    this.system[repo][name] = dict
    return dict
  }

  get_commit(repo, name) {
    let dict = this.commits[repo][name]
    if (dict) return dict

    const file = path.join(this.dirs[repo], name + '.log')
    dict = new Commit(file)

    this.commits[repo][name] = dict
    return dict
  }

  for_convert(udict) {
    return [this.lexicon, this.unique(udict)]
  }

  for_inspect(udict) {
    return [
      [this.unique(udict), 'từ ưu tiên', ';'],
      [this.lexicon, 'vietphrase', '; '],
      [this.trungviet, 'trungviet', '\n'],
      [this.cc_cedict, 'cc_cedict', '\n'],
    ]
  }

  inquire_key(repo, name, key) {
    const lookup = this.get_lookup(repo, name)
    const commit = this.get_commit(repo, name)

    return [lookup.get(key), commit.get(key)]
  }
}

module.exports = DictDB

if (!module.parent) {
  const { out_path } = require('./_util')

  const dirs = {
    common: out_path('dicts/'),
    system: out_path('dicts/system'),
    unique: out_path('dicts/unique'),
  }
  const dicts = new DictDB(dirs)
  dicts.preload('system')
  dicts.preload('unique')
}
