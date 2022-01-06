require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express")
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const helmet = require('helmet')
const path = require('path')

const userRoutes = require('./src/routes/user');
const authRoutes = require('./src/routes/authentication');
const errorParser  = require('./src/middleware/error-handler');

const app = express();
app.use(helmet())
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument))
// router
app.use('/User',userRoutes)
app.use(authRoutes)


app.use(errorParser)

mongoose
.connect(process.env.DB_URL)
.then(()=>{
    return app.listen(process.env.PORT || 8000,()=>{
        console.log(`app running in port ${process.env.PORT || 8000} with url ${process.env.DB_URL}`)
    })
})
.catch(e=>{console.log(e)})