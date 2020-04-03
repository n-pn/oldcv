const fs = require('fs')
const path = require('path')

const B58 = Array.from(
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
)

function encode_58(int) {
    let str = ''
    while (int >= 58) {
        let d = int % 58
        str = B58[d] + str
        int = (int / 58) | 0
    }
    str = B58[int] + str
    return str
}

const EPOCH = new Date(2001, 1, 1).getTime()

function epoch_time(unit = 's', date = new Date()) {
    const time = date.getTime() - EPOCH

    switch (unit) {
        case 's':
            return Math.floor(time / 1000)
        case 'm':
            return Math.floor(time / 60000)
        default:
            return time
    }
}

class TextDB {
    constructor(dir) {
        this.dir = dir
        const index_file = path.join(this.dir, 'index.json')
        this.text_index = {}

        if (!fs.existsSync(index_file)) return
        this.text_index = JSON.parse(fs.readFileSync(index_file).toString())
    }

    list() {
        return Object.values(this.text_index)
    }

    load_text(fname) {
        const filepath = path.join(this.dir, 'chapters', fname + '.json')
        if (!fs.existsSync(filepath)) return null
        return JSON.parse(fs.readFileSync(filepath).toString())
    }

    insert_text(input, udict = '0-tong-hop') {
        const fname = encode_58(epoch_time('ms'))
        this.save_text(fname, input, udict)
    }

    update_text(fname, input, udict) {
        udict = udict || this.index[fname].udict
        this.save_text(fname, input, udict)
    }

    save_text(fname, input, udict) {
        const lines = input
            .split('\n')
            .map(line => line.replace(/^[\s　]+/, '').trim())
            .filter(x => x)

        const data = { fname, lines, udict }

        fs.writeFileSync(
            path.join(this.dir, 'chapters', fname + '.json'),
            JSON.stringify(data, null, 2)
        )

        this.update_index(data)
    }

    update_index({ fname, lines, udict }) {
        this.index[fname] = {
            fname,
            udict,
            mtime: new Date().getTime(),
            title: lines[0],
            chars: lines.map(x => x.length).reduce((x, a) => x + a, 0),
        }

        fs.writeFileSync(
            path.join(this.dir, 'index.json'),
            JSON.stringify(this.index, null, 2)
        )
    }
}

module.exports = TextDB
