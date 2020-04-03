module.exports = function(tokens) {
  let output = []

  let apply_cap = true
  let add_space = false

  for (let token of tokens) {
    const [key, val] = token

    // TODO: handle `的`
    if (key === '的') {
      output.push([key, '', 0])
      continue
    }

    if (add_space && add_space_before(key)) output.push(['', ' ', 0])

    if (apply_cap && is_letter(val[0])) {
      token[1] = capitalize(val)
      apply_cap = false
    }

    apply_cap = apply_cap || apply_cap_after(key)
    add_space = add_space_after(key)
    output.push(token)
  }

  return output
}

function is_letter(char) {
  return char.toUpperCase() !== char.toLowerCase()
}

function capitalize(val) {
  return val[0].toUpperCase() + val.slice(1)
}

function add_space_before(key) {
  switch (key[0]) {
    case '”':
    case '’':
    case '⟩':
    case ')':
    case ']':
    case '}':
    case ',':
    case '.':
    case ':':
    case ';':
    case '!':
    case '?':
    case '%':
    case ' ':
    case '…':
      return false
    default:
      return true
  }
}

function add_space_after(key) {
  switch (key[key.length - 1]) {
    case '“':
    case '‘':
    case '⟨':
    case '(':
    case '[':
    case '{':
    case ' ':
      return false
    default:
      return true
  }
}

function apply_cap_after(key) {
  switch (key[key.length - 1]) {
    case '“':
    case '‘':
    case '⟨':
    case '[':
    case ']':
    case '{':
    case '.':
    case ':':
    case '!':
    case '?':
      return true
    default:
      return false
  }
}
