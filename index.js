const express = require("express")
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://gyoung:0000@cluster0.kebbe.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=>console.log('MongoDB connected...'))
.catch(err=> console.log(err))

app.get('/', (req,res)=> res.send('Hello World!!!'))
app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))