    import React, { useContext, useEffect, useRef, useState } from 'react'
    import UserContext from '../context/UserContext'
    import classes from './styles/ResentActivity.module.css'
    import CustomTitle from './UI/CustomTitle/CustomTitle'

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
                    {sentEvents.slice((sentEvents.length > 6 ? sentEvents.length - 6 : 0), sentEvents.length).map(ev => (
                        <CustomTitle key={ev.event_id}>
                            <div className={classes.event}>
                                <div>to: {ev.recipients.map(recipient => <span key={recipient.username}>{recipient.username} </span>)}</div>
                                <div>sent: {ev.time}</div>
                                <div>text: {ev.text}</div>
                            </div>
                        </CustomTitle>
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