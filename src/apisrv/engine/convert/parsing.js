module.exports = function(dicts, chars) {
    let weighted = [0]
    let selected = [['', '', 0]]

    for (let char of chars) {
        weighted.push(0)
        selected.push([char, 1, 0])
    }

    const dsize = dicts.length + 1

    for (let i = 0; i < chars.length; i++) {
        const pos_bonus = 1 + (chars.length - i) / chars.length

        for (let j = 1; j <= dicts.length; j++) {
            const dic_bonus = Math.pow(1 + j / dsize, pos_bonus)

            let dict = dicts[j - 1]

            for (let [val, len] of dict.scan_vals(chars, i)) {
                const skip = i + len
                const cost = weighted[i] + Math.pow(len, dic_bonus)

                if (cost > weighted[skip]) {
                    weighted[skip] = cost
                    selected[skip] = [val.split('/')[0], len, j]
                }
            }
        }
    }

    let output = []
    let cursor = selected.length - 1

    while (cursor > 0) {
        let token = selected[cursor]
        output.push(token)
        cursor -= token[1]
    }

    return output.reverse()
}
