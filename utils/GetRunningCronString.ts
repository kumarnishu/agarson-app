
export const GetRunningCronString = (frequency_type: string, frequency_value: string, start_date: Date) => {
    let date = new Date(start_date)
    let ftype = frequency_type
    let freq = frequency_value
    let cronString = undefined
    if (ftype === "minutes" && freq && Number(freq) > 0) {
        cronString = "20 " + "0-59" + `/${freq}` + " * * * *"
    }
    if (ftype === "hours" && freq && Number(freq) > 0) {
        cronString = "20 " + `${date.getMinutes()}` + " 0/" + `${freq}` + " * * *"
    }
    if (ftype === "days" && freq && Number(freq) > 0) {
        cronString = "20 " + `${date.getMinutes()} ` + `${date.getHours()} ` + "1/" + `${freq}` + " *" + " *"
    }

    if (ftype === "months" && freq && Number(freq) > 0) {
        let frequency = freq.split("-")[0]
        let monthdays = freq.split("-")[1]
        cronString = "20 " + `${date.getMinutes()} ` + `${date.getHours()} ` + `${monthdays} ` + `${date.getMonth()}/${Number(frequency)}` + " *"
    }

    if (ftype === "weekdays" && freq && freq.length > 0) {
        cronString = "20 " + `${date.getMinutes()} ` + `${date.getHours()} ` + " *" + " * " + freq
    }

    if (ftype === "monthdays" && freq && freq.length > 0) {
        cronString = "20 " + `${date.getMinutes()} ` + `${date.getHours()} ` + freq
            + " * " + "*"
    }
    if (ftype === "yeardays" && freq && freq.length > 0) {
        cronString = "20 " + `${date.getMinutes()} ` + `${date.getHours()} ` + freq
            + ` ${date.getMonth()} ` + "*"
    }

    return cronString
}
