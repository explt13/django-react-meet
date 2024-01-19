import React, { useContext, useEffect } from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import { privateRoutes, publicRoutes } from '../router'
import Loader from './UI/Loader/Loader'
import AuthContext from '../context/AuthContext'
import Navbar from './UI/Navbar/Navbar'
import Footer from './UI/Footer/Footer'
import Sidebar from './UI/Sidebar/Sidebar'
import Navigation from './Navigation'
import UserContext, { UserProvider } from '../context/UserContext'


const AppRouter = () => {
    const {isAuth, isAuthLoading} = useContext(AuthContext)


    if (isAuthLoading) {
        return <Loader />
    }
    return (
        isAuth
        ?
        <UserProvider>
            <div className='wrapper'>
                <BrowserRouter>
                    <Navigation />
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
            </div>
        </UserProvider>
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