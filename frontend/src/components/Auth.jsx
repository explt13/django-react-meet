import React, { useContext, useEffect, useState } from "react";
import classes from './styles/Auth.module.css'
import AuthContext from '../context/AuthContext'
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const Auth = () => {    
    const {setIsAuth} = useContext(AuthContext)
    const [errors, setErrors] = useState(null)
    const [form, setForm] = useState('login')


    const handleChangeText = (headerName) => {
        setForm(headerName)
        const header = document.getElementById('header')
        header.style.animation = `${classes.changeHeader} 0.6s forwards`
        setTimeout(() => {
            header.style.animation = 'none'
            header.style.display = 'block'
            header.style.animation = `${classes.showNewHeader} 0.6s forwards`
            header.textContent = headerName
        }, 500)
        
    }

    return (
        <div className={classes.form}>
            <div id='header' className={classes.header}>Login</div>
            {errors && errors.map(error => <div className={['alert', 'alert-danger', classes.error].join(' ')} key={error}>{error}</div>)} {/*to do */}

            {form === 'login'
            ? <LoginForm setIsAuth={setIsAuth} setErrors={setErrors} onLinkClick={handleChangeText}/>
            : <RegisterForm setIsAuth={setIsAuth} setErrors={setErrors} onLinkClick={handleChangeText} />
            }
        </div>
    )
}

export default Auth