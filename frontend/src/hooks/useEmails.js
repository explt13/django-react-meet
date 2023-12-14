import React, { useMemo } from 'react'


const useFieldSortedEmails = (emails, field) => {

  const fieldSortedEmails = useMemo(() => { // otherwise it would fire all the time i change category field
    if (field === 'newestFirst'){
      return [...emails].sort((a, b) => -a['sent'].localeCompare(b['sent']))
    } else if (field === 'oldestFirst'){
      return [...emails].sort((a, b) => a['sent'].localeCompare(b['sent']))
    }
  }, [emails, field])

  return fieldSortedEmails
}


const useEmails = (emails, category, field) => {
  const fieldSortedEmails = useFieldSortedEmails(emails, field)


  const categoryAndFilterSortedEmails = useMemo(() => {
    if (category && category !== 'all'){
      return [...fieldSortedEmails].filter(email => email.category === category)
    } 
    return [...fieldSortedEmails]
  }, [fieldSortedEmails, category])

  return categoryAndFilterSortedEmails
}


export default useEmails