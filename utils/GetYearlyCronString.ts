export function GetYearlyCronSTring(date: Date) {
    let freq = 12
    let cronString = `${date.getMinutes()} ` + `${date.getHours()} ` + `${date.getDate()} ` + `${Number(freq) === 12 ? date.getMonth() : `1/${Number(freq)}`}` + " *"
    return cronString
}