export function getDaysInMonth(date, monthInd) {
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


export function getDateInfo(monthNum){
    const date = new Date()
    const year = date.getFullYear()
    const monthInd = date.getMonth() + monthNum
    const dayOfMonth = date.getDate()

    const daysInMonth = getDaysInMonth(date, monthInd)

    const dateInfo = new Date(date.setFullYear(year, monthInd, monthNum === 0 ? dayOfMonth : 1)).toLocaleString('en-US', {year: 'numeric', month: 'long', day: '2-digit'})
    const [m, d, y] = dateInfo.split(RegExp(/, | /))
    return [d, daysInMonth, m, y]

    
}





export function getDateForInput() {
    const date = new Date()
    let [day, month, year] = date.toLocaleDateString().split('.')

    
    const minDate = `${year}-${month}-${day}`    
    
    month = Number(month) + 1
    if (month === 13){
        year = Number(year) + 1
        month = 1
    }
    if (month < 10){
        month = String('0' + month)
    }
    
    const maxDate = `${year}-${month}-${day}`

    return [minDate, maxDate]
}

export function getFormattedFullDate(date){
    const formattedDate = new Date()
    const [year, month, day] = date.split('-')
    
    formattedDate.setFullYear(year, month - 1, day) // those indexes so - 1
    return formattedDate.toLocaleString('en-US', {dateStyle: 'medium'})
}