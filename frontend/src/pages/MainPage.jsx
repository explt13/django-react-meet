import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../context/UserContext'
import classes from './styles/MainPage.module.css'
import Loader from '../components/UI/Loader/Loader'
import Categories from '../components/Categories'
import LeftsideContentMain from '../components/LeftsideContentMain'
import useRandomFriends from './../hooks/useRandomFriends'
import ResentActivity from '../components/ResentActivity'
import Calendar from '../components/Calendar'


const MainPage = () => {

  const {friends, isLoading} = useContext(UserContext) // maybe set user here
  const randomFriends = useRandomFriends(friends, 5) //?
  // const [emailQty, setEmailQty] = useState(null) ?? set here

  // const randomFriends = getRandomFriends(friends, 5) // might it trigger when there is typing for example? => useMemo
  // console.log(window.innerWidth) for mobile responsive
 
  useEffect(() => {
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
    isLoading || !randomFriends || !friends
    ? <Loader />
    :
    <>
    <header id='header' className={classes.header}>
      <div>PlanPro</div>
      <div>Organize, Invite, Meet</div>
    </header>
    <div className={['container', 'wrapper',classes.container].join(" ")}>
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