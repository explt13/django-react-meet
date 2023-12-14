import axios from 'axios'

axios.defaults.withCredentials = true;


class EventService {
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
        return response.data
    }
}

export default EventService