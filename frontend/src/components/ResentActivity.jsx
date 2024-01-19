    import React, { useContext, useEffect, useRef, useState } from 'react'
    import UserContext from '../context/UserContext'
    import classes from './styles/ResentActivity.module.css'
    import CustomTitle from './UI/CustomTitle/CustomTitle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from '@fortawesome/free-solid-svg-icons'

    const ResentActivity = () => {
        const {sentEvents} = useContext(UserContext)

        return (
            <div className={classes.container}>
                <div className={classes.eventsHeading}>
                    Your recent activity
                </div>
                {sentEvents.length !== 0 
                ?
                <div className={classes.events}>
                    {sentEvents.slice((sentEvents.length > 6 ? sentEvents.length - 6 : 0), sentEvents.length).map(event => (
                        <div key={event.event_id} className={classes.event}>
                            <div>to: {event.initial_recipients.map(recipient => <span key={recipient.username}>{recipient.username} </span>)}</div>
                            <div>sent: {event.time}</div>
                            <div>text: {event.text}</div>
                        </div>
                    ))}
                </div>
                :
                <div className={classes.noEvents}>

                    <div className={classes.noEventsText}>No recent activity</div>
                </div>
                } 
            </div>
        )
    }

    export default ResentActivity