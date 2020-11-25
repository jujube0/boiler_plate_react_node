const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const saltRounds = 10
const jwt = require('jsonwebtoken')

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

// save 전에 func 을 하도록
userSchema.pre('save', function( next ){

    var user = this;


    // 비밀번호를 바꿀 때만 암호화를 시행하도록
    if(user.isModified('password')){
        //  비밀번호를 암호화 시킨다
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);

            // 첫번째 argument 실제 비밀번호
            // hash : 암호화된 비밀번호
            bcrypt.hash(user.password , salt , function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }
    
})

// cb : call back 
userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword를 암호화된 비밀번호와 일치하는지
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    // json web token 이용해서 token 생성하기
    // user id 와 두번째 param 으로 토큰을 만들고, param 을 이용하여 나중에 userid를 찾아낸다. 
    var token = jwt.sign(user._id.toHexString(), "secretToken")

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;
    
    // decode token
    jwt.verify(token, 'secretToken', function(err,decoded){
        // 유저 아이디를 이용하여 유저를 찾은 다음에
        // 클라이언트에서 가져온 token 과 db 의 token 이 일치하는 지 확인

        user.findOne({"_id" : decoded, "token" : token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User',userSchema)

// 다른 파일에서도 쓸 수 있도록
module.exports = {User}