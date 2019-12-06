//Auth MiddleWare
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  try {
    
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.token = token
    req.userData = decoded

    next()

  } catch (e) {
    console.log(e)
    res.status(401).send({error: 'Failed Authorization'})
  }
}

module.exports = auth
