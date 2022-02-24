const express = require("express")
const app = express()
const cors = require("cors")
const port = 8080
const models = require("./models")

app.use(express.json())
app.use(cors())

app.get("/", (req,res)=>{
    res.send("연결")
})

app.listen(port, ()=>{
    console.log("연결")
    models.sequelize.sync()
    .then(()=>{
        console.log("db연결 성공")
    })
    .catch((error)=>{
        console.error(error)
    })
})