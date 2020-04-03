const fs = require('fs')
const path = require('path')

// const DictFile = require('./dict_file')
const DictRepo = require('./dictdb/dict_repo')

class DictDB {
    constructor(dir) {
        this.dir = dir
        this.base_dicts = new DictRepo(path.join(this.dir, 'base-dicts'))
        this.book_dicts = new DictRepo(path.join(this.dir, 'book-dicts'))
    }

    convert_dicts(udict = '0-tong-hop') {
        return [this.base_dict('vietphrase'), this.book_dict(udict)]
    }

    inspect_dicts(udict = '0-tong-hop') {
        return [
            [this.book_dict(udict), 'từ ưu tiên', ';'],
            [this.base_dict('vietphrase'), 'vietphrase', '; '],
            [this.base_dict('trungviet'), 'trungviet', '\n'],
            [this.base_dict('cc_cedict'), 'cc_cedict', '\n'],
        ]
    }

    hanviet_dicts() {
        return [this.base_dict('hanviet'), this.base_dict('hantrad')]
    }

    base_dict(name) {
        return this.base_dicts.get_dict(name)
    }

    book_dict(name) {
        return this.book_dicts.get_dict(name)
    }
}

module.exports = DictDB
