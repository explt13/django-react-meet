import React, { useContext, useMemo } from 'react'
import UserContext from '../context/UserContext'

const useSortedCategoryEvents = (receivedEvents, category) => {
    const sortedCategoryEvents = useMemo(() => {
        if (category === 'ALL'){
            return [...receivedEvents]
        }
        return [...receivedEvents].filter(event => event.category === category) // my event not default event
    }, [category, receivedEvents])
    return sortedCategoryEvents
}

const useSortedFriendEvents = (receivedEvents, category, friendsSortArray) => {
    const sortedCategoryEvents = useSortedCategoryEvents(receivedEvents, category)
    const sortedCategoryAndFriendsEvents = useMemo(() => {
        if (friendsSortArray.length === 0){
            return [...sortedCategoryEvents]
        }

        return [...sortedCategoryEvents].filter(event => friendsSortArray.includes(event.requester.username))
    }, [sortedCategoryEvents, friendsSortArray])
    return sortedCategoryAndFriendsEvents
}



const useSortedAcceptedEvents = (receivedEvents, category, friendsSortArray, acceptedSort) => {
    const {thisUser} = useContext(UserContext)
    const sortedFriendEvents = useSortedFriendEvents(receivedEvents, category, friendsSortArray)
    const sortedAcceptedEvents = useMemo(() => {
        if (acceptedSort){
            return [...sortedFriendEvents].filter(event => event.initial_recipients.find(recipient => recipient.username === thisUser.username).status === 'ACCEPTED')
        }
        return [...sortedFriendEvents]
        

    }, [sortedFriendEvents, acceptedSort])
    return sortedAcceptedEvents

}

const useReceivedEvents = (receivedEvents, category, friendsSortArray, acceptedSort, dateSort) => {
    const sortedAcceptedEvents = useSortedAcceptedEvents(receivedEvents, category, friendsSortArray, acceptedSort)

    const sortedDateEvents = useMemo(() => {
        if (dateSort){
            return [...sortedAcceptedEvents].filter(event => event.date === dateSort)
        }
        return [...sortedAcceptedEvents]
    }, [sortedAcceptedEvents, dateSort])
    return sortedDateEvents;
}


export default useReceivedEvents