import React from 'react'
import RegisterForm from '../components/RegisterForm'
import classes from './styles/AuthPage.module.css'

const RegisterPage = () => {
  return (
    <div className={classes.wrapper}>
        <RegisterForm />
    </div>

  )
}

export default RegisterPage