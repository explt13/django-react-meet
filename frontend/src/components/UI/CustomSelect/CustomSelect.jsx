import React, { useContext, useReducer, useRef, useState } from 'react'
import classes from './CustomSelect.module.css'
import Loader from '../Loader/Loader'
import MapContext from '../../../context/MapContext'

const CustomSelect = ({withNums, options, defaultName, className, ...props}) => {

  
  return (
    <select {...props} className={[className, classes.select].join(' ')}>
        <option disabled={true}>{defaultName}</option>
        {options.map(option => (
            <option key={option.name} value={option.value}>{option.name} {withNums && option?.qty}</option>
        ))}
    </select>
  )
}

export default CustomSelect