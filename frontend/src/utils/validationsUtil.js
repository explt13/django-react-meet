import UserService from "../API/UserService"

class ValidateFields {
    constructor(data, setData, setValid){
        this.data = data
        this.setData = setData
        this.setValid = setValid
    }
    async usernameValidation(){
        const len = this.data.username.length

        if (len < 3){
            this.setValid(prevValid => ({...prevValid, username: {valid: false, msg: 'Username must be at least 3 chars'}}))
            return false
        }

        for (let i = 0; i < len; i++) {
          const code = this.data.username.charCodeAt(i);
          if(!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 96 && code < 123)){ // lower alpha (a-z)
                this.setValid(prevValid => ({...prevValid, username: {valid: false, msg: 'Username must be alphanumeric lowercase'}}))
                return false
            }
        }
        const response = await UserService.checkUsername(this.data.username)
        if (!response.data.vacant){
            this.setValid(prevValid => ({...prevValid, username: {valid: false, msg: 'Username is taken'}}))
            return false
        }
        this.setValid(prevValid => ({...prevValid, username: {valid: true, msg: null}}))
        return true
    }
    emailValidation(){
        if (!this.data.email.includes('@')){
            this.setValid(prevValid => ({...prevValid, email: {valid: false, msg: 'Email must contain "@" char'}}))
            return false
        }
        if (this.data.email.length < 3){
            this.setValid(prevValid => ({...prevValid, email: {valid: false, msg: 'Email must be at least 3 chars'}}))
            return false
        }
        this.setValid(prevValid => ({...prevValid, email: {valid: true, msg: null}}))
        return true
    }

    passwordValidation(){
        if (this.data.password.length < 8){
            this.setValid(prevValid => ({...prevValid, password: {valid: false, msg: 'Password must be at least 8 chars'}}))
            return false
        }
        if (this.data.password !== this.data.confirmation){
            this.setValid(prevValid => ({...prevValid, password: {valid: false, msg: 'Password must match'}}))
            this.setValid(prevValid => ({...prevValid, confirmation: {valid: false, msg: 'Password must match'}}))
            return false
        }
        this.setValid(prevValid => ({...prevValid, password: {valid: true, msg: null}}))
        return true
    }

    nameValidation(){
        for (let i = 0; i < this.data.first_name.length; i++) {
            const code = this.data.first_name.charCodeAt(i);
            if(!(code > 64 && code < 91) && // upper Alpha (0-9)
                !(code > 96 && code < 123)){ // lower alpha (a-z)
                    this.setValid(prevValid => ({...prevValid, first_name: {valid: false, msg: 'First name must be alphabetic'}}))
                    this.setData(prevData => ({...prevData, first_name: ''}))
                    return false
              }
        }
        for (let i = 0; i < this.data.last_name.length; i++) {
            const code = this.data.last_name.charCodeAt(i);
            if(!(code > 64 && code < 91) && // upper Alpha (0-9)
                !(code > 96 && code < 123)){ // lower alpha (a-z)
                    this.setValid(prevValid => ({...prevValid, last_name: {valid: false, msg: 'Last name must be alphabetic'}}))
                    this.setData(prevData => ({...prevData, last_name: ''}))
                    return false
              }
        }
        this.setValid(prevValid => ({...prevValid, first_name: {valid: true, msg: null}, last_name: {valid: true, msg: null}}))
        return true
    }


    async test(){
        const isUsernameValid = await this.usernameValidation();
        const isEmailValid = this.emailValidation();
        const isPasswordValid = this.passwordValidation();
        if (isUsernameValid && isEmailValid && isPasswordValid){
            return true
        } else {
            this.setData((prevData) => ({
                ...prevData,
                username: isUsernameValid ? prevData.username : '',
                email: isEmailValid ? prevData.email : '',
                password: isPasswordValid ? prevData.password : '',
                confirmation: isPasswordValid ? prevData.confirmation : ''
            }));
            return false
        }
    }

    async isValid(){
        const valid = await this.test()
        return valid
    }


}
export default ValidateFields