import React, { useContext } from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import { privateRoutes, publicRoutes } from '../router'
import Loader from './UI/Loader/Loader'
import AuthContext from '../context/AuthContext'


const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext)
    if (isLoading) {
        return <Loader />
    }
    return (
        isAuth
        ?
        <BrowserRouter>
            <Routes>
                {privateRoutes.map((route) => (
                    <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                    element={route.element}
                    />
                ))}
            </Routes>
        </BrowserRouter>
        :
        <BrowserRouter>
            <Routes>
                {publicRoutes.map((route) => (
                    <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                    element={route.element}
                    />
                ))}
            </Routes>
        </BrowserRouter>
        
  )
}

export default AppRouter