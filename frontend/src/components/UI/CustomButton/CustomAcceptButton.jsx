import React from 'react'
import classes from './CustomButton.module.css'

const CustomAcceptButton = ({children, className, ...props}) => {
  return (
    <button {...props} className={[classes.customButton, classes.accept, className].join(' ')}>
        {children}
    </button>
  )
}

export default CustomAcceptButton