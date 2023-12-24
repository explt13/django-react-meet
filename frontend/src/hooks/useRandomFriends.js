import React, { useEffect, useState } from 'react'

const useRandomFriends = (friends, qty) => {
    const [friendsArrayCopy, setFriendsArrayCopy] = useState([])
    const [finalArray, setFinalArray] = useState([])
    useEffect(() => {
        if (friends){
            setFriendsArrayCopy([...friends])
        }
    }, [friends])

    useEffect(() => {
        
        if (friends && friendsArrayCopy.length === friends.length && friends.length > qty){
            for (let i = 0; i < qty; i++){
                const index = Math.floor(Math.random() * friendsArrayCopy.length)
                const friend = friendsArrayCopy[index]
                friendsArrayCopy.splice(index, 1)
                setFinalArray(prevFriends => [...prevFriends, friend])
            }
            
        } else if (friends && friends.length <= qty){
            setFinalArray([...friendsArrayCopy])
        }
        return () => setFinalArray([]) // clear when exit ? (why) when loaded then log out then log in it's making second time
       
    }, [friendsArrayCopy])

    return finalArray
}

export default useRandomFriends

