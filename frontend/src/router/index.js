import { Navigate } from "react-router-dom"

import ProfilePage from "../pages/ProfilePage"
import MainPage from "../pages/MainPage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import SearchPage from "../pages/SearchPage"
import FriendsPage from "../pages/FriendsPage"


export const privateRoutes = [
    {path: 'user/:username/friends', element: <FriendsPage />, exact: true},
    {path: 'search', element: <SearchPage />, exact: true},
    {path: 'user/:username', element: <ProfilePage />, exact: true},
    {path: '/', element: <MainPage />, exact: true},
    {path: '*', element: <Navigate to='/' />},

]

export const publicRoutes = [
    {path: 'login', element: <LoginPage />, exact: true},
    {path: 'register', element: <RegisterPage />, exact: true},
    {path: '*', element: <Navigate to='login' />},
]