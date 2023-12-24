import React, { useMemo } from 'react'


const useFieldSortedEmails = (emails, time) => {

  const fieldSortedEmails = useMemo(() => { // otherwise it would fire all the time i change category field
    if (time === 'newestFirst'){
      return [...emails].sort((a, b) => -a['sent'].localeCompare(b['sent']))
    } else if (time === 'oldestFirst'){
      return [...emails].sort((a, b) => a['sent'].localeCompare(b['sent']))
    }
  }, [emails, time])

  return fieldSortedEmails
}


const useEmails = (emails, category, time) => {
  const fieldSortedEmails = useFieldSortedEmails(emails, time)


  const categoryAndFilterSortedEmails = useMemo(() => {
    if (category && category !== 'ALL'){
      return [...fieldSortedEmails].filter(email => email.category === category)
    } 
    return [...fieldSortedEmails]
  }, [fieldSortedEmails, category])

  return categoryAndFilterSortedEmails
}


export default useEmails