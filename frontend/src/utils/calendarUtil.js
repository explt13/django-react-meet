export function getDays() {
    const date = new Date();
    const month = date.getMonth() + 1
    const array = Array()
    let days;
    if ([4, 6, 9, 11].includes(month)){
        days = 30
    } else if (month === 2){
        days = 28
    } else {
        days = 31
    }

    for (let i=1; i <= days; i ++){
        array.push(i)
    }

    return array
}

export function getRowsByDays() {
    const days = getDays();
    let rows;
    if (days.length <= 30){
        rows = 5
    } else {
        rows = 6
    }
    return rows
}

export function getDate(){
    const date = new Date()
    const year = date.getFullYear()
    const month = date.toLocaleString('en-US', {'month': 'short'})
    return [year, month]
}

export function getThisDay() {
    const day = new Date().getDate()
    return day
}


export function getFullDate() {
    const date = new Date()
    let day = date.getDate();
    let month = date.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
    let year = date.getFullYear();


    if (month < 10){
        month = '0' + String(month)
    }
    if (day < 10){
        day = '0' + String(day)
    }

    const minDate = `${year}-${month}-${day}`
    
    month += 1
    if (month === 13){
        year += 1
        month = '01'
    }
    const maxDate = `${year}-${month}-${day}`

    return [minDate, maxDate]
}

export function getFormattedFullDate(){
    const date = new Date()
    const formattedDate = date.toLocaleString('en-US', {dateStyle: 'medium'})
    return formattedDate
}