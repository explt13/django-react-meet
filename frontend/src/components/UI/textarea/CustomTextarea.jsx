import React from 'react'
import classes from './CustomTextarea.module.css'

const CustomTextarea = ({className, ...props}) => {
  return (
    <textarea {...props} className={[classes.textarea, className].join(' ')} />
  )
}

export default CustomTextarea