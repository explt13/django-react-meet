import React, { useEffect, useState } from 'react'

const useLocation = async () => {
    const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
      (pos) => {
        const {latitude, longitude} = pos.coords
        setPosition({latitude, longitude})
        setIsLoading(false)
      },
      (err) => {
        setError(err)
      })
    }
    getLocation()
    
  }, [])

  return position
}

export default useLocation