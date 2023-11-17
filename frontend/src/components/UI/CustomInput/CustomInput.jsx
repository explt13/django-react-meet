import React from 'react'
import classes from './CustomInput.module.css'

const CustomInput = ({className, ...props}) => {
  return (
    <input {...props} className={[classes.customInput, className].join(' ')}></input>
  )
}

export default CustomInput