import React, { useEffect} from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import {auth} from '../_actions/user_action'

export default function (SpecificComponent, option, adminRoute = null) {
    //SpecificComponent : LandingPage component
    // option : null / true / false
    //  if null : 아무나 출입이 가능
    // if true : 로그인한 유저만 출입이 가능
    // if false : 로그인한 유저는 출입이 불가능한 페이지

    // adminRoute : true이면 admin user만 출입 가능

    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        // page가 이동할때마다 dispatch가 작동
        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log(response);

                // 로그인하지 않은 상태이면 
                if (!response.payload.isAuth) {
                    if (option) {
                        props.history.push('/login');
                    }
                } else {
                    // 로그인 한 상태이면
                    if (adminRoute && ! response.payload.isAdmin) {
                        props.history.push('/')
                    } else {
                        if (! option) {
                            props.history.push('/')
                        }
                    }
                 }
            })
            
        }, [])
        return (
            <SpecificComponent/>
        )
    }
    

    return AuthenticationCheck
}