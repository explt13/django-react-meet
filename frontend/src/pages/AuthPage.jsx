
import React, { useEffect, useState } from "react";
import Auth from "../components/Auth";
import classes from './styles/AuthPage.module.css'
import { faArrowRightLong, faCalendar, faCalendarDay, faCheckCircle, faChevronDown, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AuthPage = () => {
    const [descText, setDescText] = useState('')
 
    useEffect(() => {
        const text = 'Organize, Invite, Meet'
        for (let i=0; i < text.length; i++){
            setTimeout(() => {
                setDescText(prevText => prevText + text[i])
            }, 100 * i)
        }
    }, [])

    const handleScrollButtom = () => {
        window.scroll(0, document.body.scrollHeight)
    }


    return (
        <div className={classes.container}>
            <div className={classes.heading}>
                <div className={classes.bgImageContainer}>
                    <div id='bgimage' className={classes.bgimage}></div>
                </div>
                <div className={classes.overlay}></div>
                <div className={classes.headingText}>
                    <div id='headingText'>PlanPro</div>
                    <div id='descText' className={classes.desc}>{descText}</div>
                </div>
                <div className={classes.arrowBtn} onClick={handleScrollButtom}><FontAwesomeIcon icon={faChevronDown} /></div>
            </div>
            <div className={classes.content}>
                <div className={classes.formContainer}>
                    <div className={classes.formWrapper}>
                        <Auth />
                    </div>
                </div>
                <div className={classes.showcase}>
                    <div className={classes.process}>
                        <div className={classes.showcaseItem}><FontAwesomeIcon icon={faCalendarDay} />Explore available time slots in the calendar</div>
                
                        <div className={classes.showcaseItem}><FontAwesomeIcon icon={faClock} />Select a date and time that suits you</div>
                        
                        <div className={classes.showcaseItem}><FontAwesomeIcon icon={faCheckCircle} />Complete the invitation process and receive confirmation</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage