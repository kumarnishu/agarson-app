import { utils, writeFileXLSX } from 'xlsx';


export default function ExportToExcel(data: any[], fileName: string, help?: any[]) {
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(data);
    utils.book_append_sheet(wb, ws, "Data");
    if (help) {
        let nn = utils.json_to_sheet(help)
        utils.book_append_sheet(wb, nn, "Help");
    }   
    const file = writeFileXLSX(wb, `${fileName}.xlsx`);
    return file
}
