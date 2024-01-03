import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import classes from './styles/ProfileEditPage.module.css'
import ProfileInformation from '../components/ProfileInformation'
import Loader from '../components/UI/Loader/Loader'
import CustomButton from '../components/UI/CustomButton/CustomButton'
import UserService from '../API/UserService'
import AuthContext from '../context/AuthContext'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

const ProfileEditPage = () => {
  const {csrftoken} = useContext(AuthContext)
  const navigate = useNavigate()
  const params = useParams()
  const [editedInformation, setEditedInformation] = useState({first_name: '', last_name: '', about: '', profile_pic: ''})
  const [user, setUser] = useState(null)
  const [imgURI, setImgURI] = useState(null)
  const {setAlertResponse} = useContext(UserContext)
  


  useEffect(() => {

      const getUserData = async () => {
        const response = await UserService.getUser(params.username)
        const dataCp = {...response.data}
        delete dataCp.profile_pic
        setEditedInformation(dataCp)
        setUser(response.data)
        console.log(user)
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
    <div className='wrapper container'>
      <div className={classes.profileInformationContainer}>
            <div className={classes.mainInformation}>
                <label htmlFor='profile_pic' className={classes.imgContainer}><img src={imgURI ? imgURI :`http://127.0.0.1:8000/${user.profile_pic}`}></img></label>
                <input id='profile_pic' style={{display: 'none'}} type='file' onChange={handleImg}/>
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
                    <div>
                      <div className={classes.labels}>About</div>
                      <textarea value={editedInformation.about} onChange={(ev) => setEditedInformation(prevInfo => ({...prevInfo, about: ev.target.value}))}/>
                    </div>
                    
                    <div className={classes.buttons}>
                      <div className={classes.discardChanges}><CustomButton onClick={handleDiscardChanges}>Discard changes</CustomButton></div>
                      <div className={classes.saveChanges}><CustomButton onClick={handleSaveChanges}>Save changes</CustomButton></div>
                    </div>
                </div>
            </div>
      </div>
    </div>
  )
}

export default ProfileEditPage