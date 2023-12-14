import axios from 'axios'

axios.defaults.withCredentials = true;


class MailService {
    static async getEmails(){
        const response = await axios.get(`http://127.0.0.1:8000/mail/recieved`)
        return response.data
    }

    static async deleteEmail(emailID, csrf){
        const response = await axios.delete(`http://127.0.0.1:8000/mail/delete?email_id=${emailID}`, {
            headers:{
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }
    
    static async clearMail(csrf){
        const response = await axios.delete(`http://127.0.0.1:8000/mail/clear`, {
            headers:{
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }
}

export default MailService