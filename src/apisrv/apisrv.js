const polka = require('polka')
const { json } = require('body-parser')

const PORT = 3030

function render_json(res, data, status = 200) {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = status
    return res.end(JSON.stringify(data))
}

const engine = require('./engine')

const app = polka().use(json())

app.get('/', (_req, res) => {
    render_json(res, { msg: 'ok' })
})

app.get('/texts', (_req, res) => {
    const output = []

    try {
        for (let entry of engine.texts.list()) {
            entry.vi_title = engine.convert_title(entry.title, entry.udict)
            output.push(entry)
        }
        render_json(res, output)
    } catch (e) {
        console.log(e)
        render_json(res, { mg: e.toString() }, 500)
    }
})

app.get('/texts/:slug', (req, res) => {
    const slug = req.params.slug
    const data = engine.texts.load_text(slug)
    if (!data) return render_json(res, { msg: 'Not found' }, 404)

    console.time('convert ')
    let output = engine.convert(data.lines, data.udict)
    console.timeEnd('convert ')
    render_json(res, output)
})

app.post('/convert', (req, res) => {
    const { text, dict } = req.body
    console.time('convert ')
    const json = engine.convert(text, dict)
    console.timeEnd('convert ')

    render_json(res, json)
})

app.post('/inspect', (req, res) => {
    const text = req.body.t
    const dict = req.body.d

    console.time('inspect ')
    const data = engine.inspect(text, dict)
    console.timeEnd('inspect ')

    render_json(res, data)
})

app.post('/inquire', (req, res) => {
    const input = req.body.input
    render_json(res, engine.inquire(input))
})

app.listen(PORT, err => {
    if (err) console.log('Error: ', err)
    console.log(`Starting api server on port ${PORT}`)
})
