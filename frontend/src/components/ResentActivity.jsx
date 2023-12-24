import React, { useContext } from 'react'
import UserContext from '../context/UserContext'
import classes from './styles/ResentActivity.module.css'

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
                {sentEvents.slice((sentEvents.length > 5 ? sentEvents.length - 5 : 0), sentEvents.length).map(ev => (
                <div className={classes.event} key={ev.event_id}>
                    <div>to: {ev.recipients.map(recipient => <span key={recipient.username}>{recipient.username}</span>)}</div>
                    <div>{ev.time}</div>
                    <div>{ev.text}</div>
                </div>
                ))}
            </div>
            :
            <div className={classes.noEvents}>
                <div>No recent activity</div>
            </div>
            } 
        </div>
    )
}

export default ResentActivity