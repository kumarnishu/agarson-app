
export const GetDailyCronString = (start_date: Date) => {
    let date = new Date(start_date)
    let cronString = undefined
    cronString = `${date.getMinutes()} ` + `${date.getHours()} ` + " *" + " * " + "1,2,3,4,5,6"
    return cronString
}

