import React, { useEffect, useState } from 'react'
import useEmails from '../hooks/useEmails'
import CustomSelect from './UI/CustomSelect/CustomSelect'
import classes from './../pages//styles/MailPage.module.css'

const SortEmails = ({emails, setSortedEmails}) => {
    const [sort, setSort] = useState({category: 'ALL', time: 'newestFirst'})
    const categoryAndFilterSortedEmails = useEmails(emails, sort.category, sort.time)
    
    useEffect(() => {
        setSortedEmails(categoryAndFilterSortedEmails);
    }, [categoryAndFilterSortedEmails]);

    return (
        <div className={classes.sortContainer}>
            <CustomSelect defaultName='sort by' onChange={(ev) => setSort({...sort, category: ev.target.value})} options={[
                {value: 'ALL', name: 'All'},
                {value: 'FRIENDS', name: 'Friends requests'},
                {value: 'EVENTS', name: 'Events requests'},
            ]} />
            <CustomSelect defaultName='sort by' onChange={(ev) => setSort({...sort, time: ev.target.value})} options={[
                {value: 'newestFirst', name: 'Newest first'},
                {value: 'oldestFirst', name: 'Oldest first'}
            ]}/>
        </div>
    )
}

export default SortEmails