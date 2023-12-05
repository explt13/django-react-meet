import axios from 'axios'
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;


class UserService {

    static async checkAuth(){
        const response = await axios.get('http://127.0.0.1:8000/checkauth', {withCredentials: true})
        return response
    }

    static async loginUser(data, csrf) {
        const response = await axios.post('http://127.0.0.1:8000/login', data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
        })
        return response
    }

    static async registerUser(data, csrf){
        const response = await axios.post('http://127.0.0.1:8000/register', data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            }
        })

        return response
    }

    static async getCsrf() {
        const response = await axios.get('http://127.0.0.1:8000/csrftoken')
        return response
    }


    static async logoutUser(csrf) {
        const response = await axios.post('http://127.0.0.1:8000/logout', {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            }
        })
        return response
    }



    static async searchUsers(username){
        const response = await axios.get(`http://127.0.0.1:8000/users?username=${username}`)
        return response.data
    }

    static async sendFriendRequest(username, csrf){
        const response = await axios.post(`http://127.0.0.1:8000/friend_request`, {"username": username}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            }
        })
        return response.data
    }

    static async getUser(username){
        const response = await axios.get(`http://127.0.0.1:8000/user/${username}`)
        return response.data
    }


    static async getFriends(username){
        const response = await axios.get(`http://127.0.0.1:8000/user/${username}/friends?get_friends=true`)
        return response.data
    }


    static async getSentRequests(username){
        const response = await axios.get(`http://127.0.0.1:8000/user/${username}/friends?get_sent_requests=true`)
        return response.data
    }

    static async getRecievedRequests(username){
        const response = await axios.get(`http://127.0.0.1:8000/user/${username}/friends?get_recieved_requests=true`)
        return response.data
    }

    static async deleteFriend(username, deleteUsername, csrf){
        const response = await axios.delete(`http://127.0.0.1:8000/user/${username}/friends/${deleteUsername}`,{
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            }
        })
        return response.data
    }

    static async rejectFriend(username, friendshipID, csrf){
        const response = await axios.post(`http://127.0.0.1:8000/user/${username}/friendship/${friendshipID}`, {action: 'reject'}, {
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }

    static async acceptFriend(username, friendshipID, csrf){
        const response = await axios.post(`http://127.0.0.1:8000/user/${username}/friendship/${friendshipID}`, {action: 'accept'}, {
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }

    static async sendEvent(data, csrf){

        const response = await axios.post('http://127.0.0.1:8000/event/sent', data, {
            withCredentials: true,
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json',
            }
        })
        return response.data
    }

    static async getEvents(action){
        const response = await axios.get(`http://127.0.0.1:8000/event/${action}`)
        return response.data
    }


    static async acceptEvent(marker_id, csrf){
        const response = await axios.patch(`http://127.0.0.1:8000/event/accept`, {marker_id: marker_id}, {
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }
    
    static async rejectEvent(marker_id, csrf){
        const response = await axios.delete(`http://127.0.0.1:8000/event/reject?marker_id=${marker_id}`, {
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }

    static async cancelEvent(marker_id, csrf){
        const response = await axios.delete(`http://127.0.0.1:8000/event/cancel?marker_id=${marker_id}`, {
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
    }

}

export default UserService