const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const port = 5000



const config = require("./config/key")
const { User } = require("./models/User")

// application/x-www-form-urlencoded type을 분석해서 가져오도록
app.use(bodyParser.urlencoded({extended : true}));
// application/json 파일을 가져올 수 있도록;
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose')



mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=>console.log('MongoDB connected...'))
.catch(err=> console.log(err))

// app.get('/', (req,res)=> res.send('Hello World!!!'))

app.post('/register',(req,res)=>{

    // 회원가입 시 필요한 정보들을 client 에서 가져오면
    // 그것들을 데이터 베이스에 저장

    const user = new User(req.body)


    // moongodb method : save() user model 에 저장된 것
    user.save((err, userInfo)=>{
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success : true
        })
    })

})

app.post('/login',(req,res)=>{
    // 요청된 email을 db에서 찾기
    console.log(req.body)
    User.findOne({email : req.body.email},(err,user)=>{
        if(!user){
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch)
                return res.json({  loginSuccess : false, message : "비밀번호가 틀렸습니다."})
            
            // 비밀번호까지 맞다면 토큰을 형성
            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err)
    
                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess : true, userId : user.user_id})
            })
    
        })

    })

})

app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))