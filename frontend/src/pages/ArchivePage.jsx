import React, { useContext, useEffect, useMemo, useState } from 'react'
import classes from './styles/ArchivePage.module.css'
import EventService from '../API/EventService'
import UserContext from './../context/UserContext'
import Loader from './../components/UI/Loader/Loader'
import {getFormattedFullDate} from './../utils/calendarUtil'
import { Link } from 'react-router-dom'
import CustomSelect from './../components/UI/CustomSelect/CustomSelect'
import CustomCancelButton from './../components/UI/CustomButton/CustomCancelButton'
import AuthContext from '../context/AuthContext'
import NoResult from './../components/UI/NoResult/NoResult'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxesPacking } from '@fortawesome/free-solid-svg-icons'

const ArchivePage = () => {
    const [archivedEvents, setArchivedEvents] = useState([])
    const {thisUser, isLoading, setAlertResponse} = useContext(UserContext)
    const {csrftoken} = useContext(AuthContext)
    const [senderSort, setSenderSort] = useState('ALL')
    const parser = new DOMParser()
    const [isRefreshed, setIsRefrehsed] = useState(false)

    useEffect(() => {
        document.title = 'Archive'
        const refreshEvents = async () => {
            await EventService.refreshEvents()
            const response = await EventService.getArchivedEvents()
            setArchivedEvents(response.data)
            setIsRefrehsed(true)
        }
        refreshEvents() 
    }, [])

    const sortedArchivedEventsCategory = useMemo(() => {
        if (senderSort === 'ALL'){
            return [...archivedEvents]
        }
        if (senderSort === 'REQUESTER'){
            return [...archivedEvents].filter(event => event.initial_requester.username === thisUser.username)
        }
        if (senderSort === 'RECIPIENT'){
            return [...archivedEvents].filter(event => event.initial_requester.username !== thisUser.username )
        }
        
    }, [senderSort, archivedEvents])

    const sortedArchivedEvents = useMemo(() => {
        return [...sortedArchivedEventsCategory].sort((a, b) => b.event_id - a.event_id)

    }, [sortedArchivedEventsCategory])

    const handleClearArchive = async () => {
        if (archivedEvents.length > 0){
            const response = await EventService.clearArchive(csrftoken)
            setAlertResponse({status: response.status, text: response.data})
            setArchivedEvents([])
        } else{
            setAlertResponse({status: 400, text: 'Nothing to clear'})
        }
        
    }

    return (
        isLoading || !isRefreshed
        ? <Loader />
        :
        <div className='container contentWrapper'>
            <div className={classes.header}>Archived events</div>
            <div className={classes.control}>
            <CustomSelect
                className={classes.senderSort} value={senderSort}
                onChange={(ev) => setSenderSort(ev.target.value)}
                defaultName={'sort by'}
                options={[{name: 'All', value: 'ALL'}, {name: 'You requester', value: 'REQUESTER'}, {name: 'You recipient', value: 'RECIPIENT'}]}
            />
            <CustomCancelButton className={classes.clearButton} onClick={handleClearArchive} >Clear archive</CustomCancelButton>
            </div>
            {sortedArchivedEvents.map(event => {
            const doc = parser.parseFromString(event.icon, 'text/xml')
            const iconClasses = doc.querySelector('i').className
            
            return (
                <div key={event.event_id} className={classes.container}>
                    <div className={classes.firstLastName}>Requester:  {thisUser.username === event.initial_requester.username ?<span>You</span> :<span><Link className={classes.link} to={`/user/${event.initial_requester.username}`}>{event.initial_requester.first_name} {event.initial_requester.last_name}</Link></span>}</div>
                    <div className={classes.recipients}>To: {event.initial_recipients.map((recipient, index, arr) => 
                        <span key={recipient.username} className={classes[recipient.status]}>
                            {recipient.username === thisUser.username
                            ? <span>You</span>
                            : <Link className={classes.link} to={`/user/${recipient.username}`}>{recipient.first_name} {recipient.last_name}</Link>
                            }
                            {index === arr.length - 1 ?'' :','}
                            &nbsp;
                        </span>
                    )}</div>
                    <div className={classes.category}>Category: {event.category.toLowerCase()} <i className={`${classes.categoryIcon} ${iconClasses}`}></i></div>
                    <div className={classes.content}>{event.text}</div>
                    <div className={classes.datetime}>On {getFormattedFullDate(event.date)} at {event.time}</div>
                    <div className={classes.sent}>sent {event.sent}</div>
                </div>
            )})}
            {archivedEvents.length === 0 && <NoResult data={'No archived events'} iconStyles={classes.noArchiveIcon} icon={<FontAwesomeIcon icon={faBoxesPacking} />}/>}
        </div>
    )
}

export default ArchivePage