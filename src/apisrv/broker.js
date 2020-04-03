const path = require('path')

const Engine = require('./engine/convert')

const DictDB = require('./dictdb')
const BookDB = require('./bookdb')

class Broker {
    constructor(dir) {
        this.dir = dir
        this.dictdb = new DictDB(this.dir)
        this.bookdb = new BookDB(this.dir)
    }

    convert(input, udict) {
        const dicts = this.dictdb.convert_dicts(udict)

        let output = [Engine.convert_title(input[0], dicts)]
        for (let i = 1; i < input.length; i++) {
            output.push(Engine.convert_plain(input[i], dicts))
        }
        return output
    }

    convert_title(input, udict = '0-tong-hop') {
        const dicts = this.dictdb.convert_dicts(udict)
        return Engine.convert_title(input, dicts)[1]
    }

    inspect(input, udict) {
        const hv_dicts = this.dictdb.hanviet_dicts()
        const ip_dicts = this.dictdb.inspect_dicts(udict)

        const [chinese, tokens] = Engine.convert_plain(input, hv_dicts)

        let hanviet = []
        let counter = 0

        for (let [val, len, dic] of tokens) {
            let vals = dic > 0 ? val.split(' ') : val.split('')
            if (vals.length !== len) hanviet.push([' ', -1])
            else for (let hv of vals) hanviet.push([hv, counter++])
        }

        let entries = []

        for (let i = 0; i < chinese.length; i++) {
            let entry = {}

            for (let [dict, name, joiner] of ip_dicts) {
                for (let [val, len] of dict.scan_vals(chinese, i)) {
                    entry[len] = entry[len] || []
                    entry[len].push([name, val.split('/').join(joiner)])
                }
            }

            entry = Object.entries(entry).sort((a, b) => b[0] - a[0])
            entries.push(entry)
        }

        // console.log(entries[0])
        return { chinese, hanviet, entries }
    }

    inquire(input, udict = '0-tong-hop') {
        const hv_dicts = this.dictdb.hanviet_dicts()
        const pinyins_dict = this.dictdb.load('pinyins', 'system')
        const suggest_dict = this.dictdb.load('supplement', 'common')
        const [zh, hanviet] = this.translit(input, hv_dicts)
        const chinese = zh.join('')

        return {
            chinese,
            hanviet,
            pinyins: this.translit(input, [pinyins_dict])[1].join(' '),
            common: this.dictdb.vietphrase.get(chinese),
            unique: this.dictdb.load(udict, 'unique').get(chinese),
            suggest: (suggest_dict.get_val(chinese) || '').split('/'),
        }
    }

    translit(input, dicts) {
        const [zh, tokens] = Engine.convert_plain(input, dicts)
        const out = tokens.filter(x => x[2] > 0).map(x => x[0].toLowerCase())
        return [zh, out]
    }
}

module.exports = new Broker(path.join(__dirname, '../../assets'))
