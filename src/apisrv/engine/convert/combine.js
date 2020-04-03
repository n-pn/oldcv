module.exports = function(tokens) {
    let prev = tokens[0]
    let output = [prev]

    for (let i = 1; i < tokens.length; i++) {
        const curr = tokens[i]

        if (should_combine(curr, prev)) {
            prev[0] += curr[0]
            prev[1] += curr[1]
        } else {
            output.push(curr)
            prev = curr
        }
    }

    return output
}

function should_combine(curr, prev) {
    if (curr[2] !== 0 || prev[2] !== 0) return false
    return curr[0] === prev[0].charAt(0)
}
