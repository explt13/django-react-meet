import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/MapComp.module.css'
import Map from './Map'
import UsersList from './UsersList'
import UserContext from '../context/UserContext'
import { useLocation } from 'react-router-dom'
import Loader from './UI/Loader/Loader'
import MapContext from '../context/MapContext'
import CustomSelect from './UI/CustomSelect/CustomSelect'

const MapComp = () => {
     // make for friends and searching ??
    const {selectedUsers, setSelectedUsers, setPosition, category, setCategory} = useContext(MapContext)
    const { friends, isLoading, eventCategories } = useContext(UserContext)
    const [error, setError] = useState(null)
    const { state }= useLocation() // get state from navigate
    

    useEffect(() => {
        if (state?.action === 'sort'){
            setCategory(state.sort)
        }
        if (state?.action === 'selectuser'){
            setSelectedUsers(prevUsers => [...prevUsers, {username: state.username, is_accepted: false}])
        }
    }, [])


    console.log(eventCategories)
    useEffect(() => {
        if (!isLoading){
            const timeoutID = setTimeout(() => {
                const getLocation = () => {
                    navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      const {latitude, longitude} = pos.coords
                      setPosition([latitude, longitude])
                    },
                    (err) => {
                      setError(err)
                    })
                  }
                  getLocation()
            }, 10)
            return () => clearTimeout(timeoutID)
        }
    }, [isLoading])
    

    const handleSeletedUsers = (user) => {
        const isSelected = selectedUsers.find(selectedUser => selectedUser.username === user.username)
        if (!isSelected){
            setSelectedUsers(prevUsers => [...prevUsers, {username: user.username, is_accepted: false}])
        } else {
            setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.username !== user.username))
        }
    }

    return (
        isLoading || error
        ? <Loader />
        :
        <div className={[classes.mapContainer, 'container'].join(' ')}>
            <Map />

            <div className={classes.rightPanel}>
                <div className={classes.categorySelectContainer}>
                    Sort events
                    <CustomSelect
                    withNums={true}
                    value={category}
                    onChange={(ev) => setCategory(ev.target.value)}
                    className={classes.categorySelect}
                    defaultName='Categrory'
                    options={[{name: 'All', value: 'ALL'}, ...eventCategories]}
                />
                </div>
                <div className={classes.friendsSelect}>
                    Select friends
                    {friends && !(friends.length === 0)
                    ? <UsersList resultList={friends} forMap={true} onUserClick={handleSeletedUsers} selectedUsers={selectedUsers}/>
                    : <div >seems empty..</div>}
                </div>
            </div>
        </div>
  )
}

export default MapComp