const HANZI_NUM = require('./_consts/hanzi_num.json')

const tokenize = require('./convert/tokenize')
const rephrase = require('./convert/rephrase')

function convert_para(chars, dicts) {
  if (chars.length == 0) return []
  const tokens = tokenize(chars, dicts)
  return rephrase(tokens)
}

const CHAP_RE = /^(.*?)(\s*)(第?([\d零〇一二三四五六七八九十百千]+)([章节幕回]))([,.:]?\s*)(.*)$/

function convert_head(chars, dicts) {
  let match = chars.join('').match(CHAP_RE)
  if (!match) return convert_para(chars, dicts)

  let output = []
  if (match[1] !== '') {
    output = output.concat(convert_para(match[1], dicts))
    output.push([match[2], ' ', 0])
  } else if (match[2] !== '') {
    output.push([match[2], '', 0])
  }

  output.push([match[3], translate(match[4], match[5]), 0])

  if (match[7]) {
    output.push([match[6], ': ', 0])
    output = output.concat(convert_para(match[7], dicts))
  } else {
    output.push([match[6], '', 0])
  }

  return output
}

function translate(number, label) {
  const index = HANZI_NUM[number] || number
  switch (label) {
    case '章':
      return `Chương ${index}`
    case '节':
      return `Tiết ${index}`
    case '幕':
      return `Màn ${index}`
    case '回':
      return `Hồi ${index}`
    default:
      return index
  }
}

module.exports = { convert_para, convert_head }
