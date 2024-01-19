import axios from 'axios'

axios.defaults.withCredentials = true;


class FriendService {
    static async requestWrapper(req){
        try{
            return await req
        } catch (e){
            return e.response
        }

    }

    static async sendFriendRequest(username, csrf){
        return this.requestWrapper(
            axios.post(`http://localhost:8000/friend_request`, {"username": username}, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf
                }
            })
        )
    }
    
    static async getFriends(username){
        const response = await axios.get(`http://localhost:8000/user/${username}/friends?get_friends=true`)
        return response.data
    }


    static async getSentRequests(username){
        const response = await axios.get(`http://localhost:8000/user/${username}/friends?get_sent_requests=true`)
        return response.data
    }

    static async getReceivedRequests(username){
        const response = await axios.get(`http://localhost:8000/user/${username}/friends?get_received_requests=true`)
        return response.data
    }

    static async deleteFriend(username, deleteUsername, csrf){
        return this.requestWrapper(
            axios.delete(`http://localhost:8000/user/${username}/friends/${deleteUsername}`,{
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            }
        })
        )
    }

    static async rejectFriend(username, friendshipID, csrf){
        return this.requestWrapper(
            axios.post(`http://localhost:8000/user/${username}/friendship/${friendshipID}`, {action: 'reject'}, {
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        )
    }

    static async acceptFriend(username, friendshipID, csrf){
        return this.requestWrapper(
            axios.post(`http://localhost:8000/user/${username}/friendship/${friendshipID}`, {action: 'accept'}, {
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        )
    }
    
    static async cancelFriend(username, friendshipID, csrf){
        return this.requestWrapper(
            axios.post(`http://localhost:8000/user/${username}/friendship/${friendshipID}`, {action: 'cancel'}, {
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        )
    }
}

export default FriendService