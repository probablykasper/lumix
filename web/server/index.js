const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, quiet: true })
const handle = app.getRequestHandler()

const PORT_INSECURE = process.env.PORT_INSECURE
const PORT_SECURE = process.env.PORT_SECURE

app.prepare().then(() => {
    const server = express()
    
    server.get('*', (req, res) => {
        return handle(req, res)
    })
    
    server.listen(PORT_INSECURE, err => {
        if (err) throw err
        console.log(`Ready on http://localhost:${PORT_INSECURE}`)
    })
})
