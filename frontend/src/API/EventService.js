import axios from 'axios'

axios.defaults.withCredentials = true;


class EventService {
    static async requestWrapper(req){
        try{
            return await req
        } catch (e){
            return e.response
        }

    }

    static async sendEvent(data, csrf){
        return this.requestWrapper(
            axios.post('http://localhost:8000/event/sent', data, {
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json',
            }
        })
        )
    }

    static async getSentEvents(){
        const response = await axios.get(`http://localhost:8000/event/sent`)
        return response.data
    }

    static async getReceivedEvents(){
        const response = await axios.get(`http://localhost:8000/event/received`)
        return response.data
    }
    

    static async acceptEvent(marker_id, csrf){
        return this.requestWrapper(
            axios.patch(`http://localhost:8000/event/accept`, {marker_id: marker_id}, {
                headers: {
                    'X-CSRFToken': csrf,
                    'Content-Type': 'application/json'
                }
            })
        )
    }
    
    static async rejectEvent(marker_id, csrf){
        return this.requestWrapper(
            axios.delete(`http://localhost:8000/event/reject?marker_id=${marker_id}`, {
                headers: {
                    'X-CSRFToken': csrf,
                    'Content-Type': 'application/json'
                }
            })
        )
    }

    static async cancelEvent(marker_id, csrf){
        return this.requestWrapper(
            axios.delete(`http://localhost:8000/event/cancel?marker_id=${marker_id}`, {
                headers: {
                    'X-CSRFToken': csrf,
                    'Content-Type': 'application/json'
                }
            })
        )

    }

    static async getEventsQty(){
        const response = await axios.get('http://localhost:8000/event/qty', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }

    static async refreshEvents(csrf){
        const response = await axios.get('http://localhost:8000/event/refresh', {
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        return response
    }

    static async getArchivedEvents(){
        const response = await axios.get('http://localhost:8000/event/archived', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response
    }

    static async clearArchive(csrf){
        const response = await axios.delete('http://localhost:8000/event/archived', {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            }
        })
        return response
    }
}

export default EventService