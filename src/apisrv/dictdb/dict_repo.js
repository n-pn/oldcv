const fs = require('fs')
const path = require('path')

const DictFile = require('./dict_file')

class DictRepo {
    constructor(dir) {
        this.dir = dir
        this.cache = {}

        this.idx_file = this.dir.replace(/\/$/, '') + '.json'
        if (!fs.existsSync(this.idx_file)) this.init()

        this.index = JSON.parse(fs.readFileSync(this.idx_file))
    }

    init() {
        const out_data = {}

        const files = fs.readdirSync(this.dir)
        for (let file of files) {
            if (!file.endsWith('.txt')) continue

            const name = path.basename(file, '.txt')
            const dict = this.get_dict(name)

            out_data[name] = {
                name: dict ? dict.name : name,
                size: dict ? dict.size : 0,
                mtime: dict ? dict.mtime : -1,
            }
        }

        fs.writeFileSync(this.idx_file, JSON.stringify(out_data, null, 2))
    }

    get_dict(name) {
        if (!this.cache[name]) {
            const file = path.join(this.dir, name + '.txt')
            this.cache[name] = new DictFile(file)
        }

        return this.cache[name]
    }
}

module.exports = DictRepo

// test
if (!module.parent) {
    let dir = path.resolve(__dirname, '../../../assets/base-dicts')
    let repo = new DictRepo(dir)
    console.log({ list: repo.index })

    let dict = repo.get_dict('vietphrase')
    console.log({ name: dict.name, size: dict.size })
}
