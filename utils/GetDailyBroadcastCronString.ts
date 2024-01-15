
export const GetDailyBroadcastCronString = () => {
    let cronString = undefined
    cronString = "0 " + "10 " + " *" + " * " + "1,2,3,4,5,6"
    return cronString
}

