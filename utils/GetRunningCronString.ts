
export const GetRunningCronString = (frequency_type: string, frequency_value: string, start_date: Date) => {
   
    let date = new Date(start_date)
    let ftype = frequency_type
    let freq = frequency_value
    let cronString = undefined

    if (ftype === "minutes" && freq && Number(freq) > 0) {
        cronString = "0-59" + `/${freq}` + " * * * *"
    }
    if (ftype === "hours" && freq && Number(freq) > 0) {
        cronString = `${date.getMinutes()}` + " 0/" + `${freq}` + " * * *"
    }
    if (ftype === "days" && freq && Number(freq) > 0) {
        cronString = `${date.getMinutes()} ` + `${date.getHours()} ` + "1/" + `${freq}` + " *" + " *"
    }

    if (ftype === "months" && freq && Number(freq) > 0) {
        cronString = `${date.getMinutes()} ` + `${date.getHours()} ` + `${date.getDate()} ` + `1/${freq} ` + "*"
    }

    if (ftype === "weekdays" && freq && freq.length > 0) {
        cronString = `${date.getMinutes()} ` + `${date.getHours()} ` + " *" + " * " + freq
    }

    if (ftype === "every-month-days" && freq && freq.length > 0) {
        cronString = `${date.getMinutes()} ` + `${date.getHours()} ` + freq
            + " * " + "*"
    }
    if (ftype === "selected-month-days" && freq && freq.length > 0) {
        cronString = `${date.getMinutes()} ` + `${date.getHours()} ` + freq
            + ` ${date.getMonth()} ` + "*"
    }

    return cronString
}
