import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import classes from './styles/ProfileEditPage.module.css'
import ProfileInformation from '../components/ProfileInformation'
import Loader from '../components/UI/Loader/Loader'
import CustomButton from '../components/UI/CustomButton/CustomButton'
import UserService from '../API/UserService'
import AuthContext from '../context/AuthContext'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import CustomCancelButton from '../components/UI/CustomButton/CustomCancelButton'
import CustomAcceptButton from '../components/UI/CustomButton/CustomAcceptButton'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ProfileEditPage = () => {
  const {csrftoken} = useContext(AuthContext)
  const navigate = useNavigate()
  const params = useParams()
  const [editedInformation, setEditedInformation] = useState({first_name: '', last_name: '', about: '', profile_pic: ''})
  const [user, setUser] = useState(null)
  const [imgURI, setImgURI] = useState(null)
  const {setAlertResponse, isMobile} = useContext(UserContext)
  


  useEffect(() => {

      const getUserData = async () => {
        const response = await UserService.getUser(params.username)
        const dataCp = {...response.data}
        delete dataCp.profile_pic // serializer will expect this field
        setEditedInformation(dataCp)
        setUser(response.data)
      }

      getUserData()

  }, [])
  
  const handleSaveChanges = async () => {
    const response = await UserService.updateInformation(user.username, editedInformation, csrftoken)
    setAlertResponse({status: response.status, text: response.data})
    navigate(`/user/${user.username}`)
  }
  const handleDiscardChanges = () => {
    navigate(`/user/${user.username}`)
  }

  const handleImg = (ev) => {
    setImgURI(URL.createObjectURL(ev.target.files[0]))
    setEditedInformation(prevInfo => ({...prevInfo, profile_pic: ev.target.files[0]}))
  }
  return (
    !user
    ? <Loader />
    :
    <div className='contentWrapper container'>
      <div className={classes.profileInformationContainer}>
          {!isMobile && <CustomButton className={classes.goBack} onClick={() => navigate(`/user/${user.username}`)}><FontAwesomeIcon icon={faArrowLeft}/><span>Go back</span></CustomButton>}
          <div className={classes.mainInformation}>
            <div className={classes.imgContainer}>
              <label htmlFor='profile_pic'><img src={imgURI ? imgURI :`http://127.0.0.1:8000/${user.profile_pic}`}></img></label>
              <input id='profile_pic' style={{display: 'none'}} type='file' onChange={handleImg}/>
            </div>
            <div className={classes.userInformation}>
                <div>
                  <div className={classes.labels}>First name</div>
                  <input value={editedInformation.first_name} onChange={(ev) => setEditedInformation(prevInfo => ({...prevInfo, first_name: ev.target.value}))}/>
                </div>
                <div>
                  <div className={classes.labels}>Last name</div>
                  <input value={editedInformation.last_name} onChange={(ev) => setEditedInformation(prevInfo => ({...prevInfo, last_name: ev.target.value}))}/>
                </div>
                <div>
                  <div className={classes.labels}>Username</div>
                  <input value={`@${user.username}`} disabled/>
                  </div>  
                <div className={classes.aboutContainer}>
                  <div className={classes.labels}>About</div>
                  <textarea value={editedInformation.about} onChange={(ev) => setEditedInformation(prevInfo => ({...prevInfo, about: ev.target.value}))}/>
                </div>
                
                <div className={classes.buttons}>
                  <CustomCancelButton className={classes.discardChanges} onClick={handleDiscardChanges}>Discard changes</CustomCancelButton>
                  <CustomButton className={classes.saveChanges} onClick={handleSaveChanges}>Save changes</CustomButton>
                </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default ProfileEditPage