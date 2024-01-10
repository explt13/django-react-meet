import React from 'react'
import classes from './CustomButton.module.css'

const CustomCancelButton = ({children, className, ...props}) => {
  return (
    <button {...props} className={[classes.customButton, classes.cancel, className].join(' ')}>
        {children}
    </button>
  )
}

export default CustomCancelButton