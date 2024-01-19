import axios from 'axios'

axios.defaults.withCredentials = true;


class MailService {
    static async requestWrapper(req){
        try{
            return await req
        } catch (e){
            return e.response
        }

    }

    static async getEmails(){
        const response = await axios.get(`http://127.0.0.1:8000/mail/received`)
        return response.data
    }

    static async readMail(csrf){
        return this.requestWrapper(
            axios.patch(`http://127.0.0.1:8000/mail/read`, {}, {
                headers: {
                    'X-CSRFToken': csrf,
                    'Content-Type': 'application/json'
                }
            })
        )
    }

    static async deleteEmail(emailID, csrf){
        return this.requestWrapper(
            axios.delete(`http://127.0.0.1:8000/mail/delete?email_id=${emailID}`, {
            headers:{
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        )
    }
    
    static async clearMail(csrf){
        return this.requestWrapper(
            axios.delete(`http://127.0.0.1:8000/mail/clear`, {
            headers:{
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        )
    }

    static async getEmailQty(){
        const response = await axios.get('http://127.0.0.1:8000/mail/received?qty=true')
        return response.data
    }
}

export default MailService