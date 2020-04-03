const fs = require('fs')
const path = require('path')

const { new_mtime } = require('./_util')

const SEP = '|'

class Dict {
  constructor(dir, name, user = 'local') {
    this.dic_file = path.join(dir, `${name}.dic`)
    this.fix_file = path.join(dir, `${name}.${user}.fix`)

    this.trie = [new Map(), null]
    this.list = []
    this.size = 0

    if (fs.existsSync(this.dic_file)) this.load_file(this.dic_file)
    if (fs.existsSync(this.fix_file)) this.load_file(this.fix_file)
  }

  load_file(file) {
    const label = `- [${file}] loaded`
    console.time(label)

    const lines = fs
      .readFileSync(file)
      .toString()
      .split('\n')

    for (const line of lines) {
      const item = line.trim()
      if (item) this.add(item.split(SEP))
    }

    console.timeEnd(label)
  }

  del(key) {
    this.set(key, '')
  }

  set(key, new_val = '') {
    const mtime = new_mtime()

    const node = this.get_node(key)
    let entry = node[1]

    if (entry) {
      const old_val = entry[1] || ''

      entry[1] = new_val
      entry[2] = old_val
      entry[3] = mtime

      if (new_val) this.size++
      if (old_val) this.size--
    } else {
      entry = [key, new_val, '', mtime]

      node[1] = entry
      this.list.push(entry)

      if (new_val) this.size++
    }

    fs.appendFileSync(this.fix_file, entry.join(SEP) + '\n')
    return entry
  }

  add(new_entry) {
    const node = this.get_node(new_entry[0])
    const entry = node[1]

    if (entry) {
      entry[1] = new_entry[1] // new_val
      entry[2] = new_entry[2] // old_val
      entry[3] = new_entry[3] // mtime
    } else {
      node[1] = new_entry
      this.list.push(new_entry)
      if (new_entry[1]) this.size++
    }
  }

  get_node(key) {
    let node = this.trie

    for (let char of key) {
      let next = node[0].get(char)
      if (!next) {
        next = [new Map(), null]
        node[0].set(char, next)
      }
      node = next
    }

    return node
  }

  find(key) {
    let node = this.trie

    for (let char of key) {
      node = node[0].get(char)
      if (!node) return null
    }

    return node[1]
  }

  scan(chars, idx = 0) {
    const res = []

    let node = this.trie
    for (let i = idx; i < chars.length; i++) {
      node = node[0].get(chars[i])
      if (!node) break
      if (node[1]) res.push(node[1])
    }

    return res
  }

  save_dic(file) {
    file = file || this.dic_file
    let content = ''
    for (const [key, val] of this.list) {
      if (!val) continue
      content += `${key}${SEP}${val}\n`
    }

    fs.writeFileSync(file, content)
    console.log(`- [${file}] saved: ${this.size} entries`)
  }

  save_fix(file) {
    file = file || this.fix_file
    let content = ''
    for (const entry of this.list) {
      if (!entry[3]) continue
      content += `${entry.join(SEP)}\n`
    }

    fs.writeFileSync(file, content)
    console.log(`- [${file}] saved: ${this.size} entries`)
  }

  save_all() {
    this.save_dic()
    this.save_fix()
  }
}

module.exports = Dict
