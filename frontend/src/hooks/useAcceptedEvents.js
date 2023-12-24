import React, { useMemo } from 'react'

const useAcceptedEvents = (acceptedEvents) => {
    const sortedAcceptedEvents = useMemo(() => {
        return [...acceptedEvents].sort((a, b) => a['time'].localeCompare(b['time'])).slice((acceptedEvents.length > 5 ? acceptedEvents.length - 5 : 0), acceptedEvents.length)
    }, [acceptedEvents])
    return sortedAcceptedEvents
}

export default useAcceptedEvents