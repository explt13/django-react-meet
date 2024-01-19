import React, { useId, useState } from 'react'
import CustomInput from './UI/CustomInput/CustomInput'
import CustomButton from './UI/CustomButton/CustomButton'
import classes from './styles/Auth.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import ValidateFields from '../utils/validationsUtil'

const RegistrationFirstStep = ({setStep, data, setData, onBtnClick}) => {
    const usernameId = useId()
    const emailId = useId()
    const passwordId = useId()
    const confirmationId = useId()
    const [pswdVisible, setPswdVisible] = useState({password: false, confirmation: false})
    const [valid, setValid] = useState({
        username: {valid: null, msg: null},
        email: {valid: null, msg: null},
        password: {valid: null, msg: null},
        confirmation: {valid: null, msg: null},
    })

    const nextStep = async () => {
        const validator = new ValidateFields(data, setData, setValid)
        if (await validator.isValid()){ // await promises are always truthy
            onBtnClick('Information')
            setStep('second')
        }
    }
    
    const handleUsername = (e) => {
        setData(prevData => ({...prevData, username: e.target.value}))
        setValid(prevValid => ({...prevValid, username: {...prevValid.username, valid: null, msg: null}}))
    }
    const handleEmail = (e) => {
        setData(prevData => ({...prevData, email: e.target.value}))
        setValid(prevValid => ({...prevValid, email: {...prevValid.email, valid: null, msg: null}}))
    }
    const handlePassword = (e) => {
        setData(prevData => ({...prevData, password: e.target.value}))
        setValid(prevValid => ({...prevValid, password: {...prevValid.password, valid: null, msg: null}}))
    }
    const handleConfirmation = (e) => {
        setData(prevData => ({...prevData, confirmation: e.target.value}))
        setValid(prevValid => ({...prevValid, confirmation: {...prevValid.confirmation, valid: null, msg: null}}))
    }
    

    return (
   
        <div className={classes.formBody}>
            <div className={classes.formField}>
                <label htmlFor={usernameId}>Username</label><CustomInput placeholder={valid.username.msg} className={valid.username.valid === null || valid.username.valid === true ? undefined : classes.invalid} type='text' value={data.username} onChange={handleUsername} id={usernameId}></CustomInput>
            </div>
            <div className={classes.formField}>
                <label htmlFor={emailId}>Email</label><CustomInput placeholder={valid.email.msg} className={valid.email.valid === null || valid.email.valid === true ? undefined : classes.invalid} type='email' value={data.email} onChange={handleEmail} id={emailId}></CustomInput>
            </div>
            <div className={classes.formField}>
                <label htmlFor={passwordId}>Password</label>
                <div className={classes.passwordField}>
                    <CustomInput placeholder={valid.password.msg} className={valid.password.valid === null || valid.password.valid === true ? undefined : classes.invalid} type={pswdVisible.password ? 'text' :'password'} value={data.password} onChange={handlePassword} id={passwordId}></CustomInput>
                    <span className={classes.showPasswordIcon} onClick={() => setPswdVisible(prevPswdVisible => ({...prevPswdVisible, password: !prevPswdVisible.password}))}>
                        {pswdVisible.password
                        ?<FontAwesomeIcon icon={faEyeSlash} />
                        :<FontAwesomeIcon icon={faEye} />
                        }
                    </span>
                </div>
            </div>
            <div className={classes.formField}>
                <label htmlFor={confirmationId} style={{width: '100%'}}>Confirm password</label>
                <div className={classes.passwordField}>
                    <CustomInput placeholder={valid.confirmation.msg} className={valid.confirmation.valid === null || valid.confirmation.valid === true ? undefined : classes.invalid} type={pswdVisible.confirmation ? 'text' :'password'} value={data.confirmation} onChange={handleConfirmation} id={confirmationId}></CustomInput>
                    <span className={classes.showPasswordIcon} onClick={() => setPswdVisible(prevPswdVisible => ({...prevPswdVisible, confirmation: !prevPswdVisible.confirmation}))}>
                        {pswdVisible.confirmation
                        ?<FontAwesomeIcon icon={faEyeSlash} />
                        :<FontAwesomeIcon icon={faEye} />
                        }
                    </span>
                </div>
            </div>
            <div className={classes.controls}>
                <div className={classes.firstStage}>
                    <CustomButton
                        className={classes.next}
                        disabled={!data.username || !data.password || !data.confirmation || !data.email}
                        onClick={nextStep}>Next
                    </CustomButton>
                </div>
            </div>
        </div>
        
    )
}

export default RegistrationFirstStep