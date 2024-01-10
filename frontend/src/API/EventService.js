import axios from 'axios'

axios.defaults.withCredentials = true;


class EventService {
    static async requestWrapper(req){
        try{
            return await req
        } catch (e){
            console.log(e)
            return e.response
        }

    }

    static async sendEvent(data, csrf){
        return this.requestWrapper(
            axios.post('http://127.0.0.1:8000/event/sent', data, {
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json',
            }
        })
        )
    }

    static async getSentEvents(){
        const response = await axios.get(`http://127.0.0.1:8000/event/sent`)
        return response.data
    }

    static async getRecievedEvents(){
        const response = await axios.get(`http://127.0.0.1:8000/event/recieved`)
        return response.data
    }


    static async getAcceptedEvents(){
        const response = await axios.get(`http://127.0.0.1:8000/event/recieved?accepted=true`)
        return response.data
    }


    static async acceptEvent(marker_id, csrf){
        return this.requestWrapper(
            axios.patch(`http://127.0.0.1:8000/event/accept`, {marker_id: marker_id}, {
                headers: {
                    'X-CSRFToken': csrf,
                    'Content-Type': 'application/json'
                }
            })
        )
    }
    
    static async rejectEvent(marker_id, csrf){
        return this.requestWrapper(
            axios.delete(`http://127.0.0.1:8000/event/reject?marker_id=${marker_id}`, {
                headers: {
                    'X-CSRFToken': csrf,
                    'Content-Type': 'application/json'
                }
            })
        )
    }

    static async cancelEvent(marker_id, csrf){
        return this.requestWrapper(
            axios.delete(`http://127.0.0.1:8000/event/cancel?marker_id=${marker_id}`, {
                headers: {
                    'X-CSRFToken': csrf,
                    'Content-Type': 'application/json'
                }
            })
        )

    }

    static async getEventsQty(){
        const response = await axios.get('http://127.0.0.1:8000/event/qty', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }
}

export default EventService