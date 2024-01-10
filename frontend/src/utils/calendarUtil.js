export function getDaysInMonth(monthInd) {
    const daysInMonth = new Date(2024, monthInd + 1, 0).getDate() // month bt default is zeroBased but i needed to add  +1 cuz using zero is date means get last day of previous month
    const shift = getWeekdayIndex(monthInd)

    const array = Array(shift).fill(' ', 0, shift)
    for (let i=1; i <= daysInMonth; i ++){
        array.push(i)
    }
    return array
}

export function getWeekdayIndex(monthInd){
    const weekdayIndex = (new Date(2024, monthInd, 1).getDay() + 6) % 7 // right shift 1 cuz getDay starts with Sunday
    return weekdayIndex
}


export function getDateInfo(monthShift){
    const date = new Date()
    const year = date.getFullYear()
    const monthInd = date.getMonth() + monthShift
    const dayOfMonth = date.getDate()
    const daysInMonth = getDaysInMonth(monthInd)
    const dateInfo = new Date(date.setFullYear(year, monthInd, monthShift === 0 ? dayOfMonth : 1)).toLocaleString('en-US', {year: 'numeric', month: 'long', day: '2-digit'})
    const [m, d, y] = dateInfo.split(RegExp(/, | /))
    return [d, daysInMonth, m, y]   
}

export function getMonthQty(){
    const date = new Date() // if 11 -> 0 | 0 -> 1 | 0 -> 2
    const thisMonthDate = new Date(date)
    date.setMonth(date.getMonth() + 1)
    const nextMonthDate = date
    let monthQty =  nextMonthDate.getMonth() - thisMonthDate.getMonth()
    if (nextMonthDate.getFullYear() - thisMonthDate.getFullYear()){
        monthQty = 1
    }
    const lastDay = nextMonthDate.getDate()
    return [monthQty, lastDay]
}





export function getDateForInput() {
    const date = new Date()

    const hoursOffset = date.getTimezoneOffset() / 60
    date.setHours(date.getHours() - hoursOffset)

    const currentMonthDate = date.toISOString().split('T')[0]

    date.setMonth(date.getMonth() + 1)
    const nextMonthDate = date.toISOString().split('T')[0]  // change only month on date, date same date Class with all attrs

    return [currentMonthDate, nextMonthDate]
}

export function getFormattedFullDate(date){
    const formattedDate = new Date(date)
    return formattedDate.toLocaleString('en-US', {dateStyle: 'medium'})
}

export function getCutTime(time){
    return time.slice(0, time.indexOf(':', 3))
}

