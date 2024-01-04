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


const useSentEvents = (sentEvents, category, friendsSortArray, strictSort) => {
    const sortedCategoryEvents = useSortedCategoryEvents(sentEvents, category)
    
    const sortedCategoryAndFriendsEvents = useMemo(() => {
        if (friendsSortArray.length === 0){
            return [...sortedCategoryEvents]
        }
        if (strictSort){
            return [...sortedCategoryEvents].filter(event => friendsSortArray.length === event.recipients.length && event.recipients.every(recipient => friendsSortArray.includes(recipient.username)))
        } else if (!strictSort){
            return [...sortedCategoryEvents].filter(event => event.recipients.some(recipient => friendsSortArray.includes(recipient.username)))
        }    
    }, [sortedCategoryEvents, friendsSortArray, strictSort])

  return sortedCategoryAndFriendsEvents
}

export default useSentEvents