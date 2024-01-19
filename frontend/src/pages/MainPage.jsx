import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../context/UserContext'
import classes from './styles/MainPage.module.css'
import Loader from '../components/UI/Loader/Loader'
import Categories from '../components/Categories'
import LeftsideContentMain from '../components/LeftsideContentMain'
import useRandomFriends from './../hooks/useRandomFriends'
import ResentActivity from '../components/ResentActivity'
import Calendar from '../components/Calendar'
import EventService from '../API/EventService'


const MainPage = (props) => {

  const {friends, isLoading, setReceivedEvents} = useContext(UserContext) // maybe set user here
  const randomFriends = useRandomFriends(friends, 5) //?
  const [isRefreshed, setIsRefrehsed] = useState(false)

  useEffect(() => {
    const refreshEvents = async () => {
      await EventService.refreshEvents()
      const received_events = await EventService.getReceivedEvents()
      setReceivedEvents([...received_events])
      setIsRefrehsed(true)
    }
    refreshEvents() 
  }, [])

  useEffect(() => {
    document.title = 'Planpro - Home'
    window.addEventListener('scroll', () => {
      
      const header = document.getElementById('header')
      if (header){

        if (window.scrollY > 132 && !header.classList.contains(classes.invisible50)){
          header.classList.add(classes.invisible50)
        }
        if (window.scrollY > 192 && !header.classList.contains(classes.invisible100)){
          header.classList.add(classes.invisible100)
        }
        if (window.scrollY < 133 && header.classList.contains(classes.invisible50)){
          header.classList.remove(classes.invisible50)
        }
        if (window.scrollY < 193 && header.classList.contains(classes.invisible100)){
          header.classList.remove(classes.invisible100)
        }
        
      }
      
    }) 
  }, [])

  return (
    isLoading || !isRefreshed
    ? <Loader />
    :
    <>
    <header id='header' className={classes.header}>
      <div className={classes.name}>PlanPro</div>
      <div className={classes.desc}>Organize, Invite, Meet</div>
    </header>
    <div className={['container', 'contentWrapper',classes.container].join(" ")}>
        <div className={classes.mainContainer}>
          <Categories />
          <Calendar />
          <div className={classes.mainContentContainer}>
            <LeftsideContentMain friends={friends} randomFriends={randomFriends}/>
            <ResentActivity />
          </div>
          
        </div>
    </div>
    </>
  )
}

export default MainPage