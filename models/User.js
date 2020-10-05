const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, // 문자 사이 space 를 없애준다
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    role:{ // 관리자와 일반 유저
        type: Number,
        default:0
    },
    image:String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
})

const User = mongoose.model('User',userSchema)

// 다른 파일에서도 쓸 수 있도록
module.exports = {User}