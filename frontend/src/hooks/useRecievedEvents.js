import React, { useMemo } from 'react'

const useSortedCategoryEvents = (recievedEvents, category) => {
    const sortedCategoryEvents = useMemo(() => {
        if (category === 'ALL'){
            return [...recievedEvents]
        }
        return [...recievedEvents].filter(event => event.category === category) // my event not default event
    }, [category, recievedEvents])
    return sortedCategoryEvents
}

const useRecievedEvents = (recievedEvents, category, friendsSortArray) => {
    const sortedCategoryEvents = useSortedCategoryEvents(recievedEvents, category)
    const sortedCategoryAndFriendsEvents = useMemo(() => {
        if (friendsSortArray.length === 0){
            return [...sortedCategoryEvents]
        }

        return [...sortedCategoryEvents].filter(event => friendsSortArray.includes(event.requester_username))
    }, [sortedCategoryEvents, friendsSortArray])
    return sortedCategoryAndFriendsEvents

}

export default useRecievedEvents