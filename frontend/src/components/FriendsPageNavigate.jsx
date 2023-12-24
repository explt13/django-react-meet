import React, { useMemo, useState } from 'react'
import CustomButton from './UI/CustomButton/CustomButton';
import { useParams } from 'react-router-dom';
import FriendService from '../API/FriendService';
import classes from './styles/FriendsPageNavigate.module.css'

const FriendsPageNavigate = ({setTab, setResultList}) => {

    const params = useParams()
    const [error, setError] = useState(false)

    const fetchData = async (fetchFunction) => {
        try{
          const data = await fetchFunction();
          setResultList(data)
          console.log(data)
        } catch (e) {
          setError(e.response.data)
        } finally {
    
        }
      }
    
    
      const fetchAllFriends = useMemo(() => () => FriendService.getFriends(params.username), [params.username]) // implicit return two arrow funcs cuz return func
      const fetchSentRequests = useMemo(() => () => FriendService.getSentRequests(params.username), [params.username])
      const fetchReciviedRequests = useMemo(() => () => FriendService.getRecievedRequests(params.username), [params.username])
    
      const handleAllFriends = async () => {
        fetchData(fetchAllFriends)
        setTab('friends')
      }
      const handleSentRequests = () => {
        fetchData(fetchSentRequests)
        setTab('requested')
      }
    
      const handleRecievedRequests = async () => {
        fetchData(fetchReciviedRequests)
        setTab('recieved')
      }

  return (
    <div className={classes.navigate}>
        <div>
            <CustomButton className={classes.navigateItem} onClick={handleAllFriends}>All friends</CustomButton>
            <CustomButton className={classes.navigateItem} onClick={handleSentRequests}>Sent requests</CustomButton>
            <CustomButton className={classes.navigateItem} onClick={handleRecievedRequests}>Recieved requests</CustomButton>
        </div>
    </div>
  )
}

export default FriendsPageNavigate