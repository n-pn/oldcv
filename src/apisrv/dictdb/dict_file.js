const fs = require('fs')
const path = require('path')

const to_minute = (time = new Date()) => Math.floor(time.getTime() / 60000)

const SEP_0 = '‖'

class DictFile {
    constructor(file) {
        this.file = file || 'temp.txt'
        this.name = path.basename(this.file, '.txt')
        this.vals = [new Map(), null]
        this.logs = new Map()
        this.size = 0
        this.mtime = to_minute(new Date())

        this.load(this.file)
    }

    load(file) {
        if (!fs.existsSync(this.file)) return

        this.mtime = to_minute(fs.statSync(file).mtime)

        const input = fs.readFileSync(file).toString()
        const lines = input.split('\n')

        for (let line of lines) {
            let entry = line.trim().split(SEP_0)
            if (entry[0] === '') continue

            let [key, val, mtime, old_val] = entry
            this.set_val(key, val || '')
            if (mtime) this.set_log(key, +mtime, old_val || '')
        }

        console.log(`Loaded ${lines.length} entries to dict [${this.name}]`)
    }

    set(key, new_val = '') {
        const mtime = to_minute(new Date())
        const old_val = this.set_val(key, new_val) || ''
        this.set_log(key, mtime, old_val)

        const line = `${key}‖${new_val}‖${mtime}‖${old_val}\n`
        fs.appendFileSync(this.file, line)
    }

    set_log(key, mtime, old_val) {
        this.logs.set(key, [mtime, old_val])
        this.mtime = mtime
    }

    set_val(key, new_val) {
        let node = this.vals

        for (let char of Array.from(key)) {
            let next = node[0].get(char)

            if (!next) {
                next = [new Map(), null]
                node[0].set(char, next)
            }
            node = next
        }

        const old_val = node[1]
        if (!old_val) this.size += 1

        node[1] = new_val
        return old_val
    }

    get(key) {
        return { val: this.get_val(key), log: this.logs.get(key) }
    }

    get_val(key) {
        let node = this.vals
        for (let char of Array.from(key)) {
            node = node[0].get(char)
            if (!node) return null
        }
        return node[1]
    }

    scan_vals(chars, idx = 0) {
        let vals = []
        let node = this.vals

        for (let i = idx; i < chars.length; i++) {
            node = node[0].get(chars[i])
            if (!node) break
            if (node[1]) vals.push([node[1], i - idx + 1])
        }

        return vals
    }

    *entries() {
        let queue = [[this.vals[0], '']]

        while (queue.length > 0) {
            let nodes = []

            for (let [trie, key] of queue) {
                for (let [char, [node, val]] of trie.entries()) {
                    let new_key = key + char
                    if (val !== null) {
                        let log = this.logs.get(new_key)
                        if (log) {
                            yield [new_key, val, log[0], log[1]]
                        } else {
                            yield [new_key, val]
                        }
                    }

                    nodes.push([node, new_key])
                }
            }

            queue = nodes
        }
    }

    save() {
        const list = Array.from(this.entries())
        const data = list.map(x => x.join(SEP_0) + '\n')
        fs.writeFileSync(this.file, data.join(''))
        console.log(`Saved ${list.length} entries to dict [${this.name}]`)
    }
}

module.exports = DictFile

// test
if (!module.parent) {
    let test = new DictFile('test.txt')

    test.set('a', 'a')
    test.set('b', 'b')
    test.set_val('ab', 'ab')
    test.set('c', 'c')
    test.set('d', 'd')
    test.set('a', 'c')
    test.set('c', '')
    test.set('abc', 'abc')

    console.log('Dict size: ' + test.count)
    console.log(test.scan_vals(Array.from('abc')))

    test.save()
}
