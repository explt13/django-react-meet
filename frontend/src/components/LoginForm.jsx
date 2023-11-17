import React, { useContext, useState } from 'react'
import CustomInput from './UI/CustomInput/CustomInput'
import { Link } from 'react-router-dom'
import CustomButton from './UI/CustomButton/CustomButton'
import UserService from '../API/UserService'
import classes from '../styles/LoginReg.module.css'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'


const LoginForm = () => {
    const {isAuth, setIsAuth, csrftoken} = useContext(AuthContext)
    const {userInformation, setUserInformation} = useContext(UserContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null)
    const errorClassList = ['alert', 'alert-danger', classes.error]
    
    const usernameHandler = (e) => {
        setUsername(e.target.value)
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value)
    }

    const loginUser = async () => {
        try{
            await UserService.loginUser({
            username: username,
            password: password,
            },
            csrftoken)
            
            setUsername('')
            setPassword('')
            setIsAuth(true)
            
            const getInfo = await UserService.getUser()
            setUserInformation(getInfo)
            localStorage.setItem('user', JSON.stringify(getInfo))
          


        } catch (e) {
            setError(e.response.data)
        }
    }
    
  return (
    <div className={classes.wrapper}>
        <div className={classes.container}>
            <div className={classes.greeting}>
                Login
            </div>
            {error && <div className={errorClassList.join(' ')}>{error}</div>}
            <div className={classes.form}>
                <CustomInput type='text' placeholder='Username' value={username} onChange={(e) => {usernameHandler(e)}}></CustomInput> {/* Without curly braces it returns value */}
                <CustomInput type='password' placeholder='Password' value={password} onChange={(e) => {passwordHandler(e)}}></CustomInput>
                <CustomButton
                    disabled={!username || !password}
                    onClick={loginUser}>Log in
                </CustomButton>
            </div>
            <div className={classes.footer}>
                <div>
                    Don't have an account? <span className={classes.signUp}><Link to='/register'>sign up</Link></span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LoginForm