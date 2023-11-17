import React, { useContext, useState } from 'react'
import CustomInput from './UI/CustomInput/CustomInput'
import CustomButton from './UI/CustomButton/CustomButton'
import { Link } from 'react-router-dom'
import UserService from '../API/UserService'
import classes from '../styles/LoginReg.module.css'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'

const RegisterForm = () => {
    const {isAuth, setIsAuth, csrftoken} = useContext(AuthContext)
    const {userInfromation, setUserInformation} = useContext(UserContext)
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('')
    const [errors, setErrors] = useState({})

    const errStyle = classes.errorInput

    const usernameHandler = (e) => {
        setUsername(e.target.value)
    }

    const emailHandler = (e) => {
        setEmail(e.target.value)
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value)
    }
    
    const confirmationHandler = (e) => {
        setConfirmation(e.target.value)
    }

    const registerUser = async () => {
        try{
            const response = await UserService.registerUser({
            username: username,
            email: email,
            password: password,
            confirmation: confirmation
            }, csrftoken)
            setIsAuth(true)
            setUserInformation(response.data)
            localStorage.setItem('auth', 'true')
            setUsername('')
            setEmail('')
            setPassword('')
            setConfirmation('')

            const getInfo = await UserService.getUser()
            setUserInformation(getInfo)
            localStorage.setItem('user', JSON.stringify(getInfo))

        } catch(e) {
            if (e.response.data.username){
                setUsername('')
                setErrors(errors => ({...errors, 'username': 'User already exist'}))
            }
            if (e.response.data.email){
                setEmail('')
                setErrors(errors => ({...errors, 'email': 'Enter a valid email'}))
            }
            if (e.response.data.password){
                setPassword('')
                setConfirmation('')
                setErrors(errors => ({...errors, 'password': 'Passwords must match'}))
            }
            
        }
        
    }


  return (
    <div className={classes.wrapper}>
        <div className={classes.container}>
            <div className={classes.greeting}>
                Register
            </div>
            
            <div className={classes.form}>
                <CustomInput className={errors.username ? errStyle : ''} type='text' placeholder={errors.username ? errors.username : 'Username'} value={username} onChange={(e) => {usernameHandler(e)}} />
                <CustomInput className={errors.email ? errStyle : ''} type='email' placeholder={errors.email ? errors.email : 'Email'} value={email} onChange={(e) => {emailHandler(e)}} />
                <CustomInput className={errors.password ? errStyle : ''} type='password' placeholder={errors.password ? errors.password : 'Password'} value={password} onChange={(e) => {passwordHandler(e)}} />
                <CustomInput className={errors.password ? errStyle : ''} type='password' placeholder='Confirm password' value={confirmation} onChange={(e) => {confirmationHandler(e)}} />
                <CustomButton
                    disabled={!username || !password || !email || !confirmation}
                    onClick={registerUser}>Register
                </CustomButton>
            </div>
            <div className={classes.footer}>
                <div>
                    Already have an account? <span className={classes.signUp}><Link to='/login'>sign in</Link></span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RegisterForm