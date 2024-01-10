import React, { useContext, useMemo } from 'react'
import UserContext from '../context/UserContext'

const useSortedCategoryEvents = (recievedEvents, category) => {
    const sortedCategoryEvents = useMemo(() => {
        if (category === 'ALL'){
            return [...recievedEvents]
        }
        return [...recievedEvents].filter(event => event.category === category) // my event not default event
    }, [category, recievedEvents])
    return sortedCategoryEvents
}

const useSortedFriendEvents = (recievedEvents, category, friendsSortArray) => {
    const sortedCategoryEvents = useSortedCategoryEvents(recievedEvents, category)
    const sortedCategoryAndFriendsEvents = useMemo(() => {
        if (friendsSortArray.length === 0){
            return [...sortedCategoryEvents]
        }

        return [...sortedCategoryEvents].filter(event => friendsSortArray.includes(event.requester.username))
    }, [sortedCategoryEvents, friendsSortArray])
    return sortedCategoryAndFriendsEvents
}



const useSortedAcceptedEvents = (recievedEvents, category, friendsSortArray, acceptedSort) => {
    const {thisUser} = useContext(UserContext)
    const sortedFriendEvents = useSortedFriendEvents(recievedEvents, category, friendsSortArray)
    const sortedAcceptedEvents = useMemo(() => {
        if (acceptedSort){
            return [...sortedFriendEvents].filter(event => event.recipients.find(recipient => recipient.username === thisUser.username).is_accepted === true)
        }
        if (!acceptedSort){
            return [...sortedFriendEvents].filter(event => event.recipients.find(recipient => recipient.username === thisUser.username).is_accepted === false)
        }

    }, [sortedFriendEvents, acceptedSort])
    return sortedAcceptedEvents

}

const useRecievedEvents = (recievedEvents, category, friendsSortArray, acceptedSort, dateSort) => {
    const sortedAcceptedEvents = useSortedAcceptedEvents(recievedEvents, category, friendsSortArray, acceptedSort)

    const sortedDateEvents = useMemo(() => {
        if (dateSort){
            return [...sortedAcceptedEvents].filter(event => event.date === dateSort)
        }
        return [...sortedAcceptedEvents]
    }, [sortedAcceptedEvents, dateSort])
    return sortedDateEvents;
}


export default useRecievedEvents