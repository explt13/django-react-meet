import React, { useEffect, useState } from 'react'
import classes from './../pages/styles/ProfilePage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CategoriesList from '../components/CategoriesList'
import Modal from '../components/UI/Modal/Modal'
import { faCircleArrowRight, faIcons } from '@fortawesome/free-solid-svg-icons'
import categoryStyles from '../components/styles/Categories.module.css'

const Interests = () => {
  const [interests, setInterests] = useState([])
  const [modal, setModal] = useState(false)
  const [canAdd, setCanAdd] = useState(true)

  useEffect(() => {
    if (interests.length === 5){
      setCanAdd(false)
    }else if (interests.length < 5){
      setCanAdd(true)
    }
  }, [interests])
  return (
    <div className={classes.interestsContainer}>
        <div className={classes.interestsHeading}>Tell friends your interests <FontAwesomeIcon icon={faCircleArrowRight} onClick={() => setModal(true)}/></div>
        <Modal visible={modal} setVisible={setModal}>
          <div className={classes.chooseInterests}>
            <div className={classes.chooseInterestsHeading}>Choose interests (up to 5)</div>
            <CategoriesList all={true} size={'mini'} canAdd={canAdd} setCanAdd={setCanAdd} choose={true} interests={interests} onCategoryClick={setInterests}/>
          </div>
        </Modal>
        
        <div className={categoryStyles.categories}>
          {interests.length > 0
          ?
          interests.map((interest) => (
            <div className={[classes.categoryContainer, categoryStyles.category, categoryStyles[interest.className]].join(' ')} key={interest.value}>
              <div className={categoryStyles.categoryIcon}><FontAwesomeIcon icon={interest.icon}/></div>
              <div className={categoryStyles.categoryName}>{interest.name}</div>
            </div>
           ))
          :
          <FontAwesomeIcon className={classes.noInterests} icon={faIcons}/>
          }
        </div>
    </div>
  )
}

export default Interests