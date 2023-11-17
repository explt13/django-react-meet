import React, { createContext, useEffect, useState } from 'react'
import UserService from '../API/UserService'

const UserContext = createContext(null)


export const UserProvider = ({children}) => {// otherwise props.children
    const [userInformation, setUserInformation] = useState({})

    const context = {
        userInformation,
        setUserInformation
    }


  return (
    <UserContext.Provider value={context}>
        {children}
    </UserContext.Provider>
  )
}

export default UserContext