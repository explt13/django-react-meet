import React, { useContext, useEffect, useState } from 'react'
import UserService from './../API/UserService'
import MailService from '../API/MailService'
import classes from './styles/MailPage.module.css'
import Loader from './../components/UI/Loader/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import CustomIcon from './../components/UI/CustomIcon/CustomIcon'
import AuthContext from './../context/AuthContext'
import useEmails from '../hooks/useEmails'
import SortEmails from '../components/SortEmails'
import CustomButton from './../components/UI/CustomButton/CustomButton'

const MailPage = () => {
  const [emails, setEmails] = useState([])
  const [sortedEmails, setSortedEmails] = useState([])
  const {csrftoken} = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  

  useEffect(() => {
    setIsLoading(true)
    const getEmails = async () => {
      const data = await MailService.getEmails() // read them as well?
      await MailService.readMail(csrftoken)
      console.log(data)
      setEmails([...data])
      setIsLoading(false)
    }
    getEmails()
  }, [])

  const handleEmailDelete = async (emailID) =>{
    const response = await MailService.deleteEmail(emailID, csrftoken)
    setEmails(emails.filter(email => email.id !== emailID))
    console.log(response.data)
  }

  const handleClearMail = async () => {
    const response = await MailService.clearMail(csrftoken)
    setEmails([])
    console.log(response)
  } 


  return (
    isLoading
    ? <Loader />
    :
    <div className='container wrapper'>
      <div className={classes.controlPanel}>
        <SortEmails emails={emails} setSortedEmails={setSortedEmails}/>
        <CustomButton onClick={handleClearMail}>clear mail</CustomButton>
      </div>
      <div className={classes.mailContainer}>
        {sortedEmails.map(email => (
          <div key={email.id} className={classes.mailItemContainer}>
            <div className={classes.deleteEmail}><CustomIcon onClick={() => handleEmailDelete(email.id)}><FontAwesomeIcon icon={faTrash} /></CustomIcon></div>
            <div className={classes.from}>From: {email.sender.username}</div>
            <div className={classes.to}>To: you</div>
            <hr />
            <div className={classes.header}>{email.header}</div>
            <div className={classes.content}>{email.content}</div>
            <div className={classes.sent}>sent {email.formatted_sent}</div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default MailPage