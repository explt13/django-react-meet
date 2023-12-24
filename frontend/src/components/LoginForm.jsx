import React, { useContext, useState } from 'react'
import CustomInput from './UI/CustomInput/CustomInput'
import { Link } from 'react-router-dom'
import CustomButton from './UI/CustomButton/CustomButton'
import UserService from '../API/UserService'
import classes from './styles/LoginReg.module.css'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'
import Loader from './UI/Loader/Loader'

const LoginForm = () => {
    const {isAuth, setIsAuth, csrftoken} = useContext(AuthContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const errorClassList = ['alert', 'alert-danger', classes.error]

    const usernameHandler = (e) => {
        setUsername(e.target.value)
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value)
    }

    const loginUser = async () => {
        setIsLoading(true)
        try{
            await UserService.loginUser({
            username: username,
            password: password,
            },
            csrftoken)
            
            setUsername('')
            setPassword('')
            
            setIsAuth(true)
            localStorage.setItem('username', username)
            

        } catch (e) {
            setError(e.response.data)
        } finally {
            setIsLoading(false)
        }
    }
    
  return (
    isLoading
    ? <Loader />
    :
    <div className={classes.container}>
        <div className={classes.heading}>
            Login
        </div>
        {error && <div className={errorClassList.join(' ')}>{error}</div>}
        <div className={classes.form}>
            <CustomInput type='text' placeholder='Username' value={username} onChange={(e) => {usernameHandler(e)}}></CustomInput> {/* Without curly braces it returns value */}
            <CustomInput type='password' placeholder='Password' value={password} onChange={(e) => {passwordHandler(e)}}></CustomInput>
            <CustomButton
                className={classes.enter}
                disabled={!username || !password}
                onClick={loginUser}>Log in
            </CustomButton>
        </div>
        <div className={classes.footer}>
            <div>
                Don't have an account? <div className={classes.switchPages}><Link to='/register'>sign up</Link></div>
            </div>
        </div>
    </div>

  )
}

export default LoginForm