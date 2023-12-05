import React, { useContext, useState } from 'react'
import CustomInput from '../CustomInput/CustomInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
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
            <CustomInput placeholder={`Search ${placeholder}...`} style={{marginBottom: '0px'}} value={searchValue} onKeyDown={(e) => {handleSearch(e)}} onChange={(e) => setSearchValue(e.target.value)} />
            <div className={buttonsClasses.join(' ')}>
                <CustomIcon style={{fontSize: '20px'}}><FontAwesomeIcon icon={faSearch} onClick={(e) => {handleSearch(e)}} /></CustomIcon>
                <CustomIcon style={{fontSize: '20px'}}><FontAwesomeIcon icon={faTimes} onClick={handleSearchClose} /></CustomIcon>
            </div>
        </div>
        :
        <CustomIcon><FontAwesomeIcon icon={faSearch} onClick={handleSearchOpen} /></CustomIcon>

    )
}

export default Search