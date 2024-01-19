import React, { useMemo } from 'react'

const useSortedCategoryEvents = (sentEvents, category) => {
    const sortedCategoryEvents = useMemo(() => {
        if (category === 'ALL'){
            return [...sentEvents]
        }
        return [...sentEvents].filter(event => event.category === category) // my event not default event
    }, [category, sentEvents])
    return sortedCategoryEvents
}


const useFriendSortedEvents = (sentEvents, category, friendsSortArray, strictSort) => {
    const sortedCategoryEvents = useSortedCategoryEvents(sentEvents, category)
    
    const sortedCategoryAndFriendsEvents = useMemo(() => {
        if (friendsSortArray.length === 0){
            return [...sortedCategoryEvents]
        }
        if (strictSort){
            return [...sortedCategoryEvents].filter(event => friendsSortArray.length === event.initial_recipients.length && event.initial_recipients.every(recipient => friendsSortArray.includes(recipient.username)))
        } else if (!strictSort){
            return [...sortedCategoryEvents].filter(event => event.initial_recipients.some(recipient => friendsSortArray.includes(recipient.username)))
        }    
    }, [sortedCategoryEvents, friendsSortArray, strictSort])

  return sortedCategoryAndFriendsEvents
}

const useSentEvents = (sentEvents, category, friendsSortArray, strictSort, dateSort) => {
    const friendSortedEvents = useFriendSortedEvents(sentEvents, category, friendsSortArray, strictSort)
    const dateSortedEvents = useMemo(() => {
        if (dateSort){
            return [...friendSortedEvents].filter(event => event.date === dateSort)
        }
        return [...friendSortedEvents]

    }, [friendSortedEvents, dateSort])
    return dateSortedEvents
}

export default useSentEvents