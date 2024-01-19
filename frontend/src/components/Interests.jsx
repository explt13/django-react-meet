import React, { useContext, useEffect, useState } from 'react'
import classes from './../pages/styles/ProfilePage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CategoriesList from './CategoriesList'
import Modal from './UI/Modal/Modal'
import { faCheck, faCircleArrowRight, faIcons, prefix } from '@fortawesome/free-solid-svg-icons'
import categoryStyles from './styles/Categories.module.css'
import UserService from '../API/UserService'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const Interests = ({user}) => {
  const {thisUser} = useContext(UserContext)
  const [interests, setInterests] = useState([])
  const [confirmedInterests, setConfirmedInterests] = useState([])
  const [initialInterests, setInitialInterests] = useState([])
  const [modal, setModal] = useState(false)
  const [canAdd, setCanAdd] = useState(true)
  const {csrftoken} = useContext(AuthContext)
  const {setAlertResponse, eventCategories} = useContext(UserContext)
  const [isModalClosing, setIsModalClosing] = useState(false)
  const navigate = useNavigate()
  
  const isThisUser = thisUser.username === user.username
  
  useEffect(() => {
    const fetchInterests = async () => {
      const repsonse = await UserService.getInterests(user.username)
      setInterests([...repsonse.data])
      setInitialInterests([...repsonse.data])
    }
    fetchInterests()
  }, [])

  
  useEffect(() => {
    if (interests.length === 5){
      setCanAdd(false)
    }else if (interests.length < 5){
      setCanAdd(true)
    }
  }, [interests])

  useEffect(() => {
    const saveData = async () => { //promised setstate
      const response = await UserService.saveInterests(confirmedInterests, csrftoken)
      setAlertResponse({status: response.status, text: response.data})
    }
    if (confirmedInterests.length > 0){
      saveData()
    }
  }, [confirmedInterests])

  const handleSave = async () => {
    setConfirmedInterests([...interests])
    setInitialInterests([...interests])
    setModal(false)
  }

  const cancelInterestsChange = () => {
    setInterests([...initialInterests])
  }

  const onCategoryClick = (category) => {
    navigate('/map', {state: {action: 'selectUserSelectCategory', username: user.username, first_name: user.first_name, last_name: user.last_name, category: category}})
  }

  return (
    <div className={classes.interestsContainer}>
      {isThisUser
      ?
      <>
        <div className={classes.interestsHeading}><span>Tell friends your interests</span> <FontAwesomeIcon icon={faCircleArrowRight} onClick={() => setModal(true)}/></div>
        <Modal visible={modal} setVisible={setModal} onModalClose={cancelInterestsChange}>
          <div className={classes.chooseInterests}>
            <div className={classes.chooseInterestsHeading}>Choose interests (up to 5)</div>
            <CategoriesList all={true} size={'mini'} canAdd={canAdd} setCanAdd={setCanAdd} choose={true} interests={interests} onCategoryClick={setInterests}/>
            <div className={classes.buttons}><FontAwesomeIcon onClick={handleSave} icon={faCheck} /></div>
          </div>
        </Modal>
      </>
      :
      <div className={classes.interestsHeading}>{user.first_name}'s interests list</div>
      }
        
        <div className={categoryStyles.categories}>
          {interests.length > 0
          ?
          interests.map((interest) => {
            const ec = eventCategories.find(ec => ec.value === interest)
            return(
            <div
            onClick={!isThisUser ? () => onCategoryClick(ec.value): undefined}
            className={[isThisUser ? classes.categoryDefault : classes.categoryPointer, categoryStyles.category, categoryStyles[ec.className]].join(' ')}
            key={ec.value}>
              <div className={categoryStyles.categoryIcon}><FontAwesomeIcon icon={ec.icon}/></div>
              <div className={categoryStyles.categoryName}>{ec.name}</div>
            </div>
            )
            })
          :
          <FontAwesomeIcon className={classes.noInterests} icon={faIcons}/>
          }
        </div>
    </div>
  )
}

export default Interests