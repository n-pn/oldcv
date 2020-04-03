const path = require('path')

const DictDB = require('./repo')
// const BookDB = require('./bookdb')

const format = require('./tools/format')
const { convert_head, convert_para } = require('./tools/convert')

class Chivi {
  constructor(dicts_dir, books_dir) {
    this.dictdb = new DictDB({
      common: dicts_dir,
      system: path.join(dicts_dir, 'system'),
      unique: path.join(dicts_dir, 'unique'),
    })

    this.books = {}
  }

  convert_chap(input, udict) {
    const [head, ...paras] = format.splitting(input)

    let output = this.convert_head([head], udict)
    output = output.concat(this.convert_para(paras, udict))

    return output
  }

  convert_head(input, udict) {
    const dicts = this.dictdb.for_convert(udict)

    if (typeof input === 'string') input = [input]
    return input.map(entry => {
      const chars = format.normalize(entry)
      return convert_head(chars, dicts)
    })
  }

  convert_para(input, udict) {
    const dicts = this.dictdb.for_convert(udict)

    if (typeof input === 'string') input = [input]
    return input.map(entry => {
      const chars = format.normalize(entry)
      return convert_para(chars, dicts)
    })
  }

  inspect_line(input, udict) {
    const hv_dicts = [this.dictdb.hanviet]
    const inspects = this.dictdb.for_inspect(udict)

    const hanzis = format.normalize(input)
    const tokens = convert_para(hanzis, hv_dicts)

    const entries = []
    for (let idx = 0; idx < hanzis.length; idx++) {
      const entry = {}

      for (const [dict, name, joiner] of inspects) {
        for (const [key, val] of dict.scan(hanzis, idx)) {
          entry[key] = entry[key] || []
          entry[key].push([name, val.split('/').join(joiner)])
        }
      }

      const sorted = Object.entries(entry).sort(
        ([a], [b]) => b.length - a.length
      )

      entries.push(sorted)
    }

    return { tokens, entries }
  }

  dict_entries(repo, name, opts = {}) {
    const dict = this.dictdb.get_lookup(repo, name)

    let limit = opts.limit || 50
    let offset = opts.offset || 0

    const key_re = new RegExp(opts.key || '.')
    const val_re = new RegExp(opts.val || '.')

    const output = []

    for (const [key, val] of dict.entries()) {
      if (!key_re.test(key)) continue
      if (!val_re.test(val)) continue

      if (--offset >= 0) continue
      output.push([key, val])
      if (--limit <= 0) break
    }

    return output
  }
}

//     inquire(input, udict = '0-tong-hop') {
//         const hv_dicts = this.dictdb.hanviet_dicts()
//         const pinyins_dict = this.dictdb.load('pinyins', 'system')
//         const suggest_dict = this.dictdb.load('supplement', 'common')
//         const [zh, hanviet] = this.translit(input, hv_dicts)
//         const chinese = zh.join('')

//         return {
//             chinese,
//             hanviet,
//             pinyins: this.translit(input, [pinyins_dict])[1].join(' '),
//             common: this.dictdb.vietphrase.get(chinese),
//             unique: this.dictdb.load(udict, 'unique').get(chinese),
//             suggest: (suggest_dict.get_val(chinese) || '').split('/'),
//         }
//     }

//     translit(input, dicts) {
//         const [zh, tokens] = Engine.convert_plain(input, dicts)
//         const out = tokens.filter(x => x[2] > 0).map(x => x[0].toLowerCase())
//         return [zh, out]
//     }
// }

module.exports = Chivi
