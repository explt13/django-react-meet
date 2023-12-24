import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../context/UserContext'
import classes from './styles/MainPage.module.css'
import Loader from '../components/UI/Loader/Loader'
import Categories from '../components/Categories'
import LeftsideContentMain from '../components/LeftsideContentMain'
import useRandomFriends from './../hooks/useRandomFriends'
import ResentActivity from '../components/ResentActivity'


const MainPage = () => {

  const {friends, isLoading} = useContext(UserContext) // maybe set user here
  const randomFriends = useRandomFriends(friends, 5) //?
  // const [emailQty, setEmailQty] = useState(null) ?? set here

  // const randomFriends = getRandomFriends(friends, 5) // might it trigger when there is typing for example? => useMemo
  // console.log(window.innerWidth) for mobile responsive
 



  return (
    isLoading || !randomFriends || !friends
    ? <Loader />
    :
    <div className='container wrapper'>
        <div className={classes.layout}>
          <Categories />
          <div className={classes.mainContentContainer}>
            <LeftsideContentMain friends={friends} randomFriends={randomFriends}/>
            <ResentActivity />
          </div>
        </div>
    </div>
  )
}

export default MainPage