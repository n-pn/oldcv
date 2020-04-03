module.exports = function(chars, dicts = []) {
  let weights = [0]
  let selects = [['', 0, 0]]

  // initialize
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    selects.push([char, char, 0])
    weights.push(i + 1)
  }
  // weighing choices
  const dic_total = dicts.length + 1
  for (let idx = 0; idx < chars.length; idx++) {
    const pos_bonus = idx / chars.length

    for (let dic = 1; dic < dic_total; dic++) {
      const this_dict = dicts[dic - 1]
      const dic_bonus = dic / dic_total
      // const dic_bonus = Math.pow(1 + dic / dict_count, pos_bonus)

      for (const [key, val] of this_dict.scan(chars, idx)) {
        const size = key.length
        const jump = idx + size
        const cost = weights[idx] + Math.pow(size + dic_bonus, 1 + dic_bonus)

        if (cost >= weights[jump]) {
          weights[jump] = cost
          selects[jump] = [key, val, dic]
        }
      }
    }
  }
  // extract selections

  let chosen = []
  let cursor = selects.length - 1

  while (cursor > 0) {
    const token = selects[cursor]
    token[1] = token[1].split('/')[0] // remove alternative values
    chosen.push(token)
    cursor -= token[0].length
  }

  // condense output

  let recent = chosen[chosen.length - 1]
  let output = [recent]

  for (let i = chosen.length - 2; i >= 0; i--) {
    const latest = chosen[i]

    if (should_combine(latest, recent)) {
      recent[0] += latest[0]
      recent[1] += latest[1]
    } else {
      recent = latest
      output.push(latest)
    }
  }

  return output
}

function should_combine(latest, recent) {
  return latest[2] == 0 && recent[2] == 0
  // if (latest[2] > 0 || recent[2] > 0) return false
  // if (latest[0] === recent[0].charAt(0)) return true
  // return false
}
