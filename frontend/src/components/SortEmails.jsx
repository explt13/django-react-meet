import React, { useEffect, useState } from 'react'
import useEmails from '../hooks/useEmails'
import CustomSelect from './UI/CustomSelect/CustomSelect'
import classes from './../pages//styles/MailPage.module.css'

const SortEmails = ({emails, setSortedEmails}) => {
    const [sort, setSort] = useState({category: 'all', field: 'newestFirst'})
    const categoryAndFilterSortedEmails = useEmails(emails, sort.category, sort.field)

    useEffect(() => {
        setSortedEmails(categoryAndFilterSortedEmails);
    }, [categoryAndFilterSortedEmails]);

    return (
        <div className={classes.sortContainer}>
            <CustomSelect onChange={(ev) => setSort({...sort, category: ev.target.value})} options={[
                {value: 'all', name: 'All'},
                {value: 'friends', name: 'Friends requests'},
                {value: 'events', name: 'Events reqeusts'},
            ]} />
            <CustomSelect onChange={(ev) => setSort({...sort, field: ev.target.value})} options={[
                {value: 'newestFirst', name: 'Newest first'},
                {value: 'oldestFirst', name: 'Oldest first'}
            ]}/>
        </div>
    )
}

export default SortEmails