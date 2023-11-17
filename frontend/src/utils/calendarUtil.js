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