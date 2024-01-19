import React, { useState } from 'react'
import UserService from '../API/UserService';
import Cookies from 'js-cookie';

const useInit = (setIsAuthLoading) => {

    const checkAuth = async () => {
        setIsAuthLoading(true)
        const response = await UserService.checkAuth();
        setIsAuthLoading(false)
        return response.data.auth
    
    }
    const setCsrf = async () => {
        try{
            setIsAuthLoading(true)
            const response = await UserService.getCsrf()
            Cookies.set('csrftoken', response.data.csrftoken)
        } catch (e) {
            console.log(e)
        } finally {
            setIsAuthLoading(false)
        }
    }


    return [checkAuth, setCsrf]
}

export default useInit