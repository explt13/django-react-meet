import React from 'react'
import classes from './CustomButton.module.css'

const CustomButton = ({children, className, ...props}) => {
  return (
    <button {...props} className={[classes.customButton, className].join(' ')}>
        {children}
    </button>
  )
}

export default CustomButton