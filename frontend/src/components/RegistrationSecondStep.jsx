import React, { useId, useState } from "react";
import classes from './styles/Auth.module.css'
import CustomInput from './UI/CustomInput/CustomInput'
import CustomButton from './UI/CustomButton/CustomButton'
import ValidateFields from "../utils/validationsUtil";

const RegistrationSecondStep = ({setStep, data, setData, registerUser, onBtnClick}) => {
    const firstNameId = useId()
    const lastNameId = useId()
    const imgId = useId()
    const [imgURI, setImgURI] = useState(null)
    const [valid, setValid] = useState({
        first_name: {valid: null, msg: null},
        last_name: {valid: null, msg: null}
    })
    const handleBack = () => {
        setStep('first')
        onBtnClick('Registration')
    }
    const handleFirstName = (e) => {
        setData(prevData => ({...prevData, first_name: e.target.value}))
        setValid(prevValid => ({...prevValid, first_name: {valid: null, msg: null}}))
    }
    const handleLastName = (e) => {
        setData(prevData => ({...prevData, last_name: e.target.value}))
        setValid(prevValid => ({...prevValid, last_name: {valid: null, msg: null}}))
    }

    const handleImage = (e) => {
        const URI = URL.createObjectURL(e.target.files[0])
        setData(prevData => ({...prevData, profile_pic: e.target.files[0]}))
        setImgURI(URI)
    }
    const handleRegistration = () => {
        const validator = new ValidateFields(data, setData, setValid)
        if (validator.nameValidation()){
            setImgURI(null)
            registerUser()
        }
        
    }

    return (
        <div className={classes.formBodyUserDetails}>
            <div className={classes.formField}>
                <label className={classes.imageField} htmlFor={imgId}><img src={imgURI ? imgURI : 'http://127.0.0.1:8000/media/images/default.png'}></img></label>
                <input id={imgId} type='file' style={{display: 'none'}} onChange={handleImage}></input>
            </div>
            <div className={classes.formField}>
                <label htmlFor={firstNameId}>First name</label><CustomInput placeholder={valid.first_name.msg} className={valid.first_name.valid === null || valid.first_name.valid === true ? undefined : classes.invalid} type='text' value={data.first_name} onChange={handleFirstName} id={firstNameId}></CustomInput>
            </div>
            <div className={classes.formField}>
                <label htmlFor={lastNameId}>Last name</label><CustomInput placeholder={valid.last_name.msg} className={valid.last_name.valid === null || valid.last_name.valid === true ? undefined : classes.invalid} type='text' value={data.last_name} onChange={handleLastName} id={lastNameId}></CustomInput>
            </div>

            <div className={classes.controls}>
                <div className={classes.secondStage}>
                    <CustomButton
                        className={classes.back}
                        onClick={handleBack}>Back
                    </CustomButton>
                    <CustomButton
                        className={classes.register}
                        disabled={!data.first_name || !data.last_name}
                        onClick={handleRegistration}>Register
                    </CustomButton>
                </div>
            </div>
        </div>
  
    )
}

export default RegistrationSecondStep