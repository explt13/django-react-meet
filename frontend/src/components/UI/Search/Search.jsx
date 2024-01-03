import React, { useContext, useState } from 'react'
import CustomInput from '../CustomInput/CustomInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes, faXmark } from '@fortawesome/free-solid-svg-icons'
import classes from './Search.module.css'
import CustomIcon from '../CustomIcon/CustomIcon'
import UserService from '../../../API/UserService'
import { useNavigate, useParams } from 'react-router-dom'



const Search = ({qty, placeholder, handleSearch, searchValue, setSearchValue}) => {
     // expanse it to many fields
    const [isSearch, setIsSearch] = useState(false)
    const [isSearchClose, setIsSearchClose] = useState(false)


    const searchClasses = [classes.search]
    const buttonsClasses = [classes.buttons]




    const handleSearchOpen = () => {
        setIsSearch(true)
    }

    const handleSearchClose = () => {
      setIsSearchClose(true)
      const timeoutId = setTimeout(() => {
        setIsSearch(false)
        setIsSearchClose(false)
      }, 500)
      return () => clearTimeout(timeoutId)
    }


    if (isSearchClose){
      searchClasses.push(classes.inactive)
      buttonsClasses.push(classes.inactive)
    }

    return (
        isSearch
        ?
        <div className={searchClasses.join(' ')}>
            <CustomInput placeholder={`Search ${placeholder}...`} className={classes.searchInput} value={searchValue} onKeyDown={(e) => {handleSearch(e)}} onChange={(e) => setSearchValue(e.target.value)} />
            <div className={buttonsClasses.join(' ')}>
                <CustomIcon className={classes.searchIcon}><FontAwesomeIcon icon={faSearch} onClick={(e) => {handleSearch(e)}} /></CustomIcon>
                <CustomIcon className={classes.searchClose}><FontAwesomeIcon icon={faXmark} onClick={handleSearchClose} /></CustomIcon>
            </div>
        </div>
        :
        <CustomIcon className={classes.searchButton}><FontAwesomeIcon icon={faSearch} onClick={handleSearchOpen} /></CustomIcon>

    )
}

export default Search