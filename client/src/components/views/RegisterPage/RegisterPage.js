import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { registerUser} from '../../../_actions/user_action';
import { withRouter} from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    //typing 하면 onChange 를 발생시켜 state를 바꿔주어 value를 바꾼다.
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }
    const onSubmitHandler = (event) => {
        // page refresh를 막아준다
        event.preventDefault();

        if (Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호확인은 같아야 합니다');
        }
        // 서버에 보내기
        let body = {
            email : Email,
            name : Name,
            password : Password
        }

        dispatch(registerUser(body))
            .then(response => {
                if (response.payload.success) {
                    props.history.push('/login');
                } else {
                    alert('Failed to Signup');
                }
            })

        // Axios.post('/api/users/login', body)
        // .then(response => {
            
        // })
    }
    return (
        <div style ={{
            display : 'flex', justifyContent : 'center', alignItems: 'center',
            width : '100%', height : '100vh'
        }}>
            <form style ={{display : 'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type = "email" value = {Email} onChange={onEmailHandler}/>

                <label>Name</label>
                <input type = "text" value = {Name} onChange={onNameHandler}/>

                <label>Password</label>
                <input type = "password" value = {Password} onChange={onPasswordHandler}/>

                <label>Confirm Password</label>
                <input type = "password" value = {ConfirmPassword} onChange={onConfirmPasswordHandler}/>
                <br/>
                <button type = 'submit'>
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)
