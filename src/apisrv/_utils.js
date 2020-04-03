const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

const EPOCH = new Date(2019, 1, 1).getTime()

function encode58(int) {
    let str = ''
    while (int > 0) {
        str = B58.charAt(int % 58) + str
        int = Math.trunc(int / 58)
    }
    return str
}

function gen_time(unit = 's', date = new Date()) {
    const time = date.getTime() - EPOCH

    switch (unit) {
        case 's':
            return (time / 1000) | 0
        case 'm':
            return (time / 60000) | 0
        default:
            return time
    }
}

function split_lines(input) {
    return input
        .split('\n')
        .map(line => line.replace(/^[\s　]+/, '').trim())
        .filter(x => x)
}

module.exports = { encode58, gen_time, split_lines }

const time = new Date().getTime()
console.log(time / 1000)
console.log((time / 1000) | 0)
