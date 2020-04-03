const NORMALIZE = require('./_consts/normalize.json')

function normalize(input) {
  let output = []
  for (let char of input) output.push(NORMALIZE[char] || char)
  return output
}

function splitting(input) {
  return input
    .split('\n')
    .map(x => x.replace(/　/g, '').trim())
    .filter(x => x)
}

module.exports = {
  normalize,
  splitting,
}

if (!module.parent) {
  console.log(normalize('第三章 没本事的男人').join(''))
}
