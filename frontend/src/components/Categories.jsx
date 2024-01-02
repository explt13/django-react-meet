import React, { useContext, useMemo } from 'react'
import classes from './styles/Categories.module.css'
import UserContext from '../context/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight, faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import CustomTitle from './UI/CustomTitle/CustomTitle'
import CategoriesList from './CategoriesList'


const Categories = () => {
    
    return (
        <div className={classes.categoryContainer}>
              <div className={classes.categoryHeading}>
                Categories
              </div>
              <CategoriesList choose={false} all={false}/>
              <div className={classes.moreCategories}>
                explore more.. <Link to='/categories'><CustomIcon className={classes.arrow}><FontAwesomeIcon icon={faCircleArrowRight} /></CustomIcon></Link>
              </div>
        </div>
  )
}

export default Categories