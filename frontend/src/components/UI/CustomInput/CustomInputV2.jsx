import React from 'react'
import classes from './CustomInputV2.module.css'

const CustomInputV2 = ({className, ...props}) => {
  return (
    <input {...props} className={[classes.input, className].join(' ')}/>
  )
}

export default CustomInputV2