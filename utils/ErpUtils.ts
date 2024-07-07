import { IPartyTargetReport, IState } from "../types/erp_report.types";

export function GetMonthlyachievementBystate(reports: IPartyTargetReport[], mont: number) {
    let result = Number(reports.reduce((a, b) => { return Number(a) + Number(b.Cur_Jul) }, 0).toFixed())
    return result
}

export function GetYearlyachievementBystate(reports: IPartyTargetReport[]) {
    let result = Number(reports.reduce((a, b) => { return Number(a) + Number(b.Cur_Apr) + Number(b.Cur_May) + Number(b.Cur_Jun) + Number(b.Cur_Jul) + Number(b.Cur_Aug) + Number(b.Cur_Sep) + Number(b.Cur_Oct) + Number(b.Cur_Nov) + Number(b.Cur_Dec) + Number(b.Cur_Jan) + Number(b.Cur_Feb) + Number(b.Cur_Mar) }, 0).toFixed())
    return result
}

export function GetLastYearlyachievementBystate(reports: IPartyTargetReport[]) {
    let result = Number(reports.reduce((a, b) => { return Number(a) + Number(b.Last_Apr) + Number(b.Last_May) + Number(b.Last_Jun) + Number(b.Last_Jul) + Number(b.Last_Aug) + Number(b.Last_Sep) + Number(b.Last_Oct) + Number(b.Last_Nov) + Number(b.Last_Dec) + Number(b.Last_Jan) + Number(b.Last_Feb) + Number(b.Last_Mar) }, 0).toFixed())
    return result
}