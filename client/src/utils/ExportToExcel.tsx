import { utils, writeFileXLSX } from 'xlsx';


export default function ExportToExcel(data: any[], fileName: string) {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    const file = writeFileXLSX(wb, `${fileName}.xlsx`);
    return file
}
