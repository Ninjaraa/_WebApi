const dotenv = require('dotenv').config()
const cors = require('cors')
const port = process.env.WEBAPI_PORT || 9999
const initMongoDB = require('./mongodb')
const { graphqlHTTP } = require('express-graphql')
const express = require('express')
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes // if false the testmode will disappear
app.use('/api/products', require('./controllers/productsController'))
app.use('/graphql', graphqlHTTP({
    schema: require('./schemas/graphQL/graphqlSchema') ,
    graphiql: true 
}))

app.use('/api/authentication', require('./controllers/authenticationController'))

// Initialize - Start up
initMongoDB()
app.listen(port, () => console.log(`Webapi is ready to go at http://localhost:${port}`))