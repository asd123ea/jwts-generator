const express = require('express')
var fs = require("fs");
const app = express()
var uuid = require('uuid-v4');

const port = process.env.PORT || 3000

var private_key = fs.readFileSync("./key.pem");
var header = {
    kid: "bdef4554463d8078be9af1d9de55"
};

app.get('/create', (req, res) => {
    if (req.headers.authorization !== 'Basic QXp1cmVEaWFtb25kOmh1bnRlcjI=') {
        res.set('WWW-Authenticate', 'Basic realm="401"')
        res.status(401).send('Try user: AzureDiamond, password: hunter2')
        return
    }

    console.log(private_key)

    const jwt = require('njwt')
    const claims = { iss: 'testing@secure.istio.io', sub: 'testing@secure.istio.io', jti: uuid(),  }
    const token = jwt.create(claims, private_key, 'RS256')
    token.setExpiration(new Date().getTime() + (60*3) * 1000)
    res.send(token.compact())
})

app.get('/verify/:token', (req, res) => {
    const jwt = require('njwt')
    const { token } = req.params
    jwt.verify(token, private_key, 'RS256', (err, verifiedJwt) => {
        if (err) {
            res.send(err.message)
        } else {
            res.send(verifiedJwt)
        }
    })
})

app.get('/', (req, res) => res.send('asdsadasds'))

app.listen(port, () => console.log(`JWT server listening on port ${port}!`))