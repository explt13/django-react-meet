import React from 'react'
import LoginForm from '../components/LoginForm'
import classes from './styles/AuthPage.module.css'

const LoginPage = () => {
  return (
    <div className={classes.wrapper}>
      <LoginForm />
    </div>
  )
}

export default LoginPage