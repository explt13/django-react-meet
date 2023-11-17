import axios from 'axios'

axios.defaults.withCredentials = true;


class UserService {

    static async checkAuth(){
        const response = await axios.get('http://127.0.0.1:8000/checkauth/', {withCredentials: true})
        return response
    }

    static async loginUser(data, csrf) {
        const response = await axios.post('http://127.0.0.1:8000/login/', data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
        })
        return response
    }

    static async registerUser(data, csrf){
        const response = await axios.post('http://127.0.0.1:8000/register/', data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            }
        })

        return response
    }

    static async getCsrf() {
        const response = await axios.get('http://127.0.0.1:8000/csrftoken/')
        return response
    }


    static async logoutUser(csrf) {
        const response = await axios.post('http://127.0.0.1:8000/logout/', {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            }
        })
        return response
    }

    static async getUser(){
        const response = await axios.get('http://127.0.0.1:8000/user/')
        return response.data
    }
}

export default UserService