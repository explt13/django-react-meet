import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useMemo } from 'react'
import UserContext from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import classes from './styles/Categories.module.css'

const CategoriesList = ({all}) => {

    const { eventCategories } = useContext(UserContext)
    const sortedEventCategories = useMemo(() => {
        return [...eventCategories].sort((a, b) => b.qty - a.qty)
    }, [eventCategories])
        
    const navigate = useNavigate()

    return (
        <div className={[classes.categories, all ? classes.all : undefined].join(' ')}>
            {(all ? sortedEventCategories : sortedEventCategories.slice(0, 4)).map(category => (
                <div className={[classes.category, classes[category.className]].join(' ')}  key={category.name} onClick={() => navigate('/map', {state: {action: 'sort', sort: category.value}})}>
                    <div className={[classes.categoryIcon].join(' ')}><FontAwesomeIcon icon={category.icon}/></div>
                    <div className={classes.categoryName}>{category.name}</div>
                    {all && 
                    <div className={classes.qty}>{category.qty}</div>
                    }
                </div>
            ))}
        </div>
    )
}

export default CategoriesList