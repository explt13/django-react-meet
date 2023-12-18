import React, { useState } from 'react'
import UserService from '../API/UserService';
import Cookies from 'js-cookie';

const useInit = (setIsLoading) => {

    const checkAuth = async () => {
        setIsLoading(true)
        const response = await UserService.checkAuth();
        setIsLoading(false)
        return response.data.auth
    
    }
    const setCsrf = async () => {
        try{
            setIsLoading(true)
          const response = await UserService.getCsrf()
          Cookies.set('csrftoken', response.data.csrftoken)
        } catch (e) {
          console.log(e)
        } finally {
            setIsLoading(false)
        }
    }


    return [checkAuth, setCsrf]
}

export default useInit