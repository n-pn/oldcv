module.exports = function(tokens) {
    let output = []

    let apply_cap = true
    let add_space = false

    for (let token of tokens) {
        let [val, _len, dic] = token

        if (val === '的') {
            output.push(['', 1, 0])
        } else if (dic === 0) {
            if (add_space && should_space_before(val)) {
                output.push([' ', 0, 0])
            }

            if (apply_cap && is_alnum(val.charAt(0))) {
                token[0] = capitalize(val)
                apply_cap = false
            } else {
                apply_cap = apply_cap || should_cap_after(val)
            }

            output.push(token)

            add_space = should_space_after(val)
        } else {
            if (add_space && should_space_before(val)) {
                output.push([' ', 0, 0])
            }

            if (apply_cap) token[0] = capitalize(val)

            output.push(token)

            apply_cap = should_cap_after(val) || dic === 3
            add_space = should_space_after(val)
        }
    }

    // console.log({ grammar: output })

    return output
}

function is_alnum(char) {
    return char.toUpperCase() !== char.toLowerCase()
}

function capitalize(val) {
    return val.charAt(0).toUpperCase() + val.slice(1)
}

function should_space_before(key) {
    switch (key.charAt(0)) {
        case ')':
        case ']':
        case '}':
        case '”':
        case '’':
        case ',':
        case '.':
        case '?':
        case '!':
        case ':':
        case ' ':
        case '~':
        case '…':
        case '⟩':
        case ';':
            return false
        default:
            return true
    }
}

function should_space_after(key) {
    switch (key.charAt(key.length - 1)) {
        case '(':
        case '[':
        case '{':
        case '“':
        case '‘':
        case ' ':
        case '⟨':
            return false
        default:
            return true
    }
}

function should_cap_after(key) {
    switch (key.charAt(key.length - 1)) {
        case '.':
        case '?':
        case '!':
        case '[':
        case '{':
        case '“':
        case '‘':
        case ':':
        case '⟨':
        case ']':
            return true
        default:
            return false
    }
}
