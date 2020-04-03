const parsing = require('./convert/parsing')
const combine = require('./convert/combine')
const grammar = require('./convert/grammar')

const NORMALIZE = require('./consts/normalize.json')
const CHAPINDEX = require('./consts/chapindex.json')

const CHARS = '零〇一二三四五六七八九百千十'
const TYPES = '章节幕回'

const TITLE_RE = new RegExp(`^(.*?)(第?[${CHARS}\\d]+[${TYPES}][.:]*\\s*)(.*)$`)
const INDEX_RE = new RegExp(`^第?([${CHARS}\\d]+)([${TYPES}]).*$`)

function convert_plain(input, dicts) {
    const chars = normalize(input)
    const tokens = parsing(dicts, chars)
    return [chars, grammar(combine(tokens))]
}

function normalize(input) {
    const chars = Array.from(input)
    return chars.map(char => NORMALIZE[char] || char)
}

function convert_title(input, dicts) {
    let out_zh = []
    let out_vi = []

    const [volume, index, chapter] = split_title(input)

    if (volume !== '') {
        const [zh, vi] = convert_plain(volume, dicts)
        out_zh.push(...zh)
        out_vi.push(...vi)
    }

    if (index !== '') {
        if (volume !== '') out_vi.push([' ', 0, 0]) // add whitespace
        const zh = normalize(index)
        out_zh.push(...zh)
        out_vi.push([translate_index(index), zh.length, 0])
    }

    if (chapter !== '') {
        if (index !== '') out_vi.push([' ', 0, 0]) // add whitespace
        const [zh, vi] = convert_plain(chapter, dicts)
        out_zh.push(...zh)
        out_vi.push(...vi)
    }

    return [out_zh, out_vi]
}

function split_title(input) {
    let match = input.match(TITLE_RE)

    if (!match) return ['', '', input]
    let [_, prev, body, next] = match
    return [prev, body, next]
}

function translate_index(input) {
    const match = input.match(INDEX_RE)

    const [_, index, type] = match

    const label = CHAPINDEX[index] || index

    switch (type) {
        case '章':
            return `Chương ${label}:`
        case '节':
            return `Tiết ${label}:`
        case '幕':
            return `Màn ${label}:`
        case '回':
            return `Hồi ${label}:`
    }
}

module.exports = {
    convert_title,
    convert_plain,
}
