import React, { useContext, useMemo } from 'react'
import classes from './styles/Categories.module.css'
import UserContext from '../context/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight, faGraduationCap } from '@fortawesome/free-solid-svg-icons'

const Categories = () => {
    const { eventCategories } = useContext(UserContext)
    const sortedEventCategories = useMemo(() => {
        return [...eventCategories].sort((a, b) => b.qty - a.qty)
    }, [eventCategories])
    
    const navigate = useNavigate()

    return (
        <div className={classes.categoryContainer}>
              <div className={classes.categoryHeading}>
                Categories
              </div>
              <div className={classes.categories}>
                {sortedEventCategories.slice(0, 4).map(category => (
                    <div className={[classes.category,  classes[category.className]].join(' ')}  key={category.name} onClick={() => navigate('/map', {state: {action: 'sort', sort: category.value}})}>
                        <div className={[classes.categoryIcon].join(' ')}><FontAwesomeIcon icon={category.icon}/></div>
                        <div className={classes.categoryName}>{category.name}</div>
                    </div>
                ))}
              </div>
              <div className={classes.moreCategories}>
                  explore more..
                  <Link to='/map'><CustomIcon className={classes.arrow}><FontAwesomeIcon icon={faCircleArrowRight} /></CustomIcon></Link>
              </div>
        </div>
  )
}

export default Categories