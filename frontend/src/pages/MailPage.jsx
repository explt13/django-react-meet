import React, { useContext, useEffect, useState } from 'react'
import UserService from './../API/UserService'
import MailService from '../API/MailService'
import classes from './styles/MailPage.module.css'
import Loader from './../components/UI/Loader/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopesBulk, faTrash } from '@fortawesome/free-solid-svg-icons'
import CustomIcon from './../components/UI/CustomIcon/CustomIcon'
import AuthContext from './../context/AuthContext'
import useEmails from '../hooks/useEmails'
import SortEmails from '../components/SortEmails'
import CustomButton from './../components/UI/CustomButton/CustomButton'
import UserContext from '../context/UserContext'
import { getFormattedFullDate } from '../utils/calendarUtil'
import CustomCancelButton from '../components/UI/CustomButton/CustomCancelButton'
import NoResult from '../components/UI/NoResult/NoResult'

const MailPage = () => {
  const [emails, setEmails] = useState([])
  const [sortedEmails, setSortedEmails] = useState([])
  const {csrftoken} = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const {setEmailQty, setAlertResponse} = useContext(UserContext)
  

  useEffect(() => {
    document.title = 'Mail'
    setIsLoading(true)
    const getEmails = async () => {
      const data = await MailService.getEmails()
      await MailService.readMail(csrftoken)
      setEmailQty(0)
      setEmails([...data])
      setIsLoading(false)
    }
    getEmails()
  }, [])

  const handleEmailDelete = async (emailID) =>{
    const response = await MailService.deleteEmail(emailID, csrftoken)
    setEmails(emails.filter(email => email.id !== emailID))
    setAlertResponse({status: response.status, text: response.data})
  }

  const handleClearMail = async () => {
    if (emails.length > 0){
      const response = await MailService.clearMail(csrftoken)
      setEmails([])
      setAlertResponse({status: response.status, text: response.data})
    } else{
      setAlertResponse({status: 400, text: 'Nothing to clear'})
    }
  
  } 
  

  return (
    isLoading
    ? <Loader />
    :
    <div className='container contentWrapper'>
      <div className={classes.heading}>
        Mail
      </div>
      <div className={classes.controlPanel}>
        <SortEmails emails={emails} setSortedEmails={setSortedEmails}/>
        <CustomCancelButton onClick={handleClearMail} className={classes.clearMail}>clear mail</CustomCancelButton>
      </div>
      <div className={classes.mailContainer}>
        {sortedEmails.map(email => (
          <div key={email.id} className={classes.mailItemContainer}>
            <div className={classes.deleteEmail}><CustomIcon onClick={() => handleEmailDelete(email.id)}><FontAwesomeIcon icon={faTrash} /></CustomIcon></div>
            <div className={classes.from}>From: {email.sender.username}</div>
            <div className={classes.to}>To: you</div>
            <hr />
            <div className={classes.header}>{email.header}</div>
            <div className={classes.content}>{email.content} on {getFormattedFullDate(email.event_date)}</div>
            <div className={classes.sent}>sent {email.formatted_sent}</div>
          </div>
        ))}
        {sortedEmails.length === 0 && <NoResult iconStyles={classes.noMail}  data={'No received emails'} icon={<FontAwesomeIcon icon={faEnvelopesBulk} />}/>}
      </div>
    </div>
  )
}

export default MailPage