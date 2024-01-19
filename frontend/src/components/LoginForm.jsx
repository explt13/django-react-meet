import React, { useContext, useEffect, useId, useLayoutEffect, useState } from "react";
import classes from './styles/Auth.module.css'
import CustomInput from "../components/UI/CustomInput/CustomInput";
import CustomButton from "../components/UI/CustomButton/CustomButton";
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../API/UserService'
import AuthContext from '../context/AuthContext'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const LoginForm = ({setIsAuth, setErrors, onLinkClick}) => {
    const usernameId = useId()
    const passwordId = useId()
    const {csrftoken} = useContext(AuthContext)
    const [data, setData] = useState({username: '', password: ''})
    const [pswdVisible, setPswdVisible] = useState(false)
    const navigate = useNavigate()

    const loginUser = async () => {

        const response = await UserService.loginUser(data, csrftoken)

        setData({username: '', password: ''})
        if (response.status === 200){
            navigate('/')
            setIsAuth(true)
            localStorage.setItem('username', data.username)
        }
        if (response.status === 400){
            setErrors(response.data)
        }
    }
    
    return (
        <>
        <div className={classes.formBody}>
            <div className={classes.formField}>
                <label htmlFor={usernameId}>Username</label><CustomInput  type='text' value={data.username} onChange={(e) => setData(prevData => ({...prevData, username: e.target.value}))} id={usernameId}></CustomInput>
            </div>
            <div className={classes.formField}>
                <label htmlFor={passwordId}>Password</label>
                <div className={classes.passwordField}>
                    <CustomInput type={pswdVisible ? 'text' :'password'} value={data.password} onChange={(e) => setData(prevData => ({...prevData, password: e.target.value}))} id={passwordId}></CustomInput>
                    <span className={classes.showPasswordIcon} onClick={() => setPswdVisible(!pswdVisible)}>
                    {pswdVisible
                    ?<FontAwesomeIcon icon={faEyeSlash} />
                    :<FontAwesomeIcon icon={faEye} />
                    }
                    </span>
                </div>
            </div>
            <div className={classes.controls}>
                <div className={classes.login}>
                    <CustomButton
                        disabled={!data.username || !data.password}
                        onClick={loginUser}>Log in
                    </CustomButton>
                    </div>
                </div>
        </div>
        <div className={classes.footer}>
            Don't have an account? <span className={classes.switch} onClick={() => onLinkClick('register')}>sign up</span>
        </div>
        </>
    )
}

export default LoginForm