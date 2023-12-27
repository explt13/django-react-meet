import { Navigate } from "react-router-dom"

import ProfilePage from "../pages/ProfilePage"
import MainPage from "../pages/MainPage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import SearchPage from "../pages/SearchPage"
import FriendsPage from "../pages/FriendsPage"
import MailPage from "../pages/MailPage"
import MapPage from "../pages/MapPage"
import CategoriesPage from "../pages/CategoriesPage"
import ProfileEditPage from "../pages/ProfileEditPage"


export const privateRoutes = [
    {path: 'user/:username/friends', element: <FriendsPage />, exact: true},
    {path: 'user/:username/edit', element: <ProfileEditPage />, exact: true},
    {path: 'categories', element: <CategoriesPage />, exact: true},
    {path: 'map', element: <MapPage />, excat: true},
    {path: 'search', element: <SearchPage />, exact: true},
    {path: 'mail', element: <MailPage />, excat: true},
    {path: 'user/:username', element: <ProfilePage />, exact: true},
    {path: '/', element: <MainPage />, exact: true},
    {path: '*', element: <Navigate to='/' />},

]

export const publicRoutes = [
    {path: 'login', element: <LoginPage />, exact: true},
    {path: 'register', element: <RegisterPage />, exact: true},
    {path: '*', element: <Navigate to='login' />},
]