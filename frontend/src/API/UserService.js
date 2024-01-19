import axios from 'axios'
import { redirect, useNavigate } from 'react-router-dom';



axios.defaults.withCredentials = true;


class UserService { // should I split it
    static async requestWrapper(req){
        try{
            return await req
        } catch (e){
            console.log(e)
            return e.response
        }

    }
    static async getCsrf() {
        const response = await axios.get('http://localhost:8000/csrftoken')
        return response
    }

    static async checkAuth(){
        const response = await axios.get('http://localhost:8000/checkauth', {withCredentials: true})
        return response
    }

    static async checkUsername(username){
        const response = await axios.get(`http://localhost:8000/checkusername/${username}`)
        return response
    }

    static async loginUser(data, csrf) {
        return this.requestWrapper(
            axios.post('http://localhost:8000/login', data, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
        })
        )
    }

    static async registerUser(data, csrf){
        return this.requestWrapper(
            axios.post('http://localhost:8000/register', data=data, {
            headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrf
                }
            })
        )
    }




    static async logoutUser(csrf) {
        return this.requestWrapper(
            axios.post('http://localhost:8000/logout', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf
                }
            })
        )

    }



    static async searchUsers(username){
        const response = await axios.get(`http://localhost:8000/users?query=${username}`)
        return response.data
    }


    static async getUser(username){
        return this.requestWrapper(
            axios.get(`http://localhost:8000/user/${username}`) // need for login erros handling 
        )
    }

    static async updateInformation(username, data, csrf){
        return this.requestWrapper(
            axios.patch(`http://localhost:8000/user/${username}/update`, data=data, {
                headers: {
                    'X-CSRFToken': csrf,
                    'Content-Type': 'multipart/form-data'
                }
            })
        )
    }

    static async getInterests(username){
        return await axios.get(`http://localhost:8000/user/${username}/interest`)
    }

    static async saveInterests(data, csrf){
        return this.requestWrapper(
            axios.post('http://localhost:8000/interest', data, {
                headers: {
                    'X-CSRFToken': csrf,
                    'Content-Type': 'application/json'
                }
            })
        )
    }

}

export default UserService