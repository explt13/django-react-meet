import React, { useContext, useEffect, useId, useState } from 'react'
import CustomInput from './UI/CustomInput/CustomInput'
import CustomButton from './UI/CustomButton/CustomButton'
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../API/UserService'
import classes from './styles/Auth.module.css'
import AuthContext from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import ValidateFields, { isAlphaNumeric } from '../utils/validationsUtil'
import RegistrationFirstStep from './RegistrationFirstStep'
import RegistrationSecondStep from './RegistrationSecondStep'

const RegisterForm = ({setIsAuth, setErrors, onLinkClick}) => {
    const {csrftoken} = useContext(AuthContext)
    const [data, setData] = useState({username: '', email: '', password: '', confirmation: '', first_name: '', last_name: ''})
    const [step, setStep] = useState('first')
    const navigate = useNavigate()

    useEffect(() => {
        document.title = 'Register'
        
    }, [])

    const registerUser = async () => {
        const response = await UserService.registerUser(data, csrftoken)
        setData({username: '', email: '', password: '', confirmation: '', first_name: '', last_name: ''})

        if (response.status === 201){
            navigate('/')
            setIsAuth(true)
            localStorage.setItem('auth', 'true')
            localStorage.setItem('username', data.username)
        }
            
        if (response.status === 400){
            console.log(response)
            setErrors(response.data)
            setStep('first')
        } 
    }
    
    
    return (
        <>
        {step === 'first'
        ? <RegistrationFirstStep setStep={setStep} data={data} setData={setData} onBtnClick={onLinkClick} />
        : <RegistrationSecondStep setStep={setStep} data={data} setData={setData} registerUser={registerUser} onBtnClick={onLinkClick}/>
        }
        
        <div className={classes.footer}>
            Already have an account? <span className={classes.switch} onClick={() => onLinkClick('login')}>sign in</span>
        </div>
        </>
    )
}

export default RegisterForm