import { Navigate } from "react-router-dom"
import ProfilePage from "../pages/ProfilePage"
import MainPage from "../pages/MainPage"
import SearchPage from "../pages/SearchPage"
import FriendsPage from "../pages/FriendsPage"
import MailPage from "../pages/MailPage"
import MapPage from "../pages/MapPage"
import CategoriesPage from "../pages/CategoriesPage"
import ProfileEditPage from "../pages/ProfileEditPage"
import ErrorPage from "../pages/ErrorPage"
import ArchivePage from "../pages/ArchivePage"
import AuthPage from "../pages/AuthPage"


export const privateRoutes = [
    {path: 'user/:username/friends', element: <FriendsPage />, exact: true},
    {path: 'user/:username/edit', element: <ProfileEditPage />, exact: true},
    {path: 'archive', element: <ArchivePage />, exact: true},
    {path: 'categories', element: <CategoriesPage />, exact: true},
    {path: 'map', element: <MapPage />, excat: true},
    {path: 'search', element: <SearchPage />, exact: true},
    {path: 'mail', element: <MailPage />, excat: true},
    {path: 'user/:username', element: <ProfilePage />, exact: true},
    {path: '/', element: <MainPage />, exact: true},
    {path: '*', element: <ErrorPage />},

]

export const publicRoutes = [
    {path: 'login', element: <AuthPage />, exact: true},
    {path: '*', element: <Navigate to='login' />},
]