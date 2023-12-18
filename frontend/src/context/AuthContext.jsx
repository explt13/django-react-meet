import Cookies from 'js-cookie'
import React, { createContext, useEffect, useState } from 'react'
import useInit from '../hooks/useInit'

const AuthContext = createContext(false)

export const AuthProvider = ({children}) => {
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [checkAuth, setCsrf] = useInit(setIsLoading)
    const csrftoken = Cookies.get('csrftoken')

    useEffect(() => {
        const init = async() =>{
          const auth = await checkAuth()
          setIsAuth(auth)
          if (csrftoken === undefined){
            setCsrf()
          }
        }
        init()
        
      }, [])
    
    const context = {
        isAuth,
        setIsAuth,
        isLoading,
        csrftoken
    }
    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext