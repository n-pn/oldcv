const get_minute = time => Math.floor(time.getTime() / 60000)
const EPOCH = get_minute(new Date('2020-01-01T00:00:00.000Z'))
const new_mtime = () => get_minute(new Date()) - EPOCH

module.exports = {
  new_mtime,
}
