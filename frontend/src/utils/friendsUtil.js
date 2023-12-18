
export const getRandomFriends = (friendsArray, qty) => {
    if (friendsArray){
        const friendsArrayCopy = [...friendsArray]
        const finalArray = []
        for (let i = 0; i < qty; i++){
            const index = Math.floor(Math.random() * friendsArrayCopy.length)
            const friend = friendsArrayCopy[index]
            friendsArrayCopy.splice(index, 1)
            finalArray.push(friend)
        }
        return finalArray
    }
    
}

