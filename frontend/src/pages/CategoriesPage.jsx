import React, { useEffect } from 'react'
import CategoriesList from '../components/CategoriesList'
import classes from './styles/CategoriesPage.module.css'

const CategoriesPage = () => {
  useEffect(() => {
    document.title = 'Categories'
  }, [])

  return (
    <div className='container contentWrapper'>
        <div className={classes.heading}>All Categories</div>
        <CategoriesList all={true} withQty={true} choose={false}/>
    </div>
  )
}

export default CategoriesPage