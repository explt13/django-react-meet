import React from 'react'
import CategoriesList from '../components/CategoriesList'
import classes from './styles/CategoriesPage.module.css'

const CategoriesPage = () => {

  return (
    <div className='container wrapper'>
        <div className={classes.heading}>All Categories</div>
        <CategoriesList all={true} withQty={true} choose={false}/>
    </div>
  )
}

export default CategoriesPage