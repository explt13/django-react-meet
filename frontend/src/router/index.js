import { Navigate } from "react-router-dom"
import Register from "../pages/Register"
import Login from "../pages/Login"
import Main from "../pages/Main"


export const privateRoutes = [
    {path: '/', element: <Main />, exact: true},
    {path: '*', element: <Navigate to='/' />},
]

export const publicRoutes = [
    {path: 'login', element: <Login />, exact: true},
    {path: 'register', element: <Register />, exact: true},
    {path: '*', element: <Navigate to='login' />},
]