import React from 'react'
import classes from './CustomSelect.module.css'

const CustomSelect = ({options, ...props}) => {
  return (
    <select {...props}>
        <option disabled={true}>sort by</option>
        {options.map(option => (
            <option key={option.value} value={option.value}>{option.name}</option>
        ))}
    </select>
  )
}

export default CustomSelect