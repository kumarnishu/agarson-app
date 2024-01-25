import { utils, writeFileXLSX } from 'xlsx';

type Data = any[]

export default function ExportToExcel(data: any[], fileName: string, helps?: Data[]) {
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(data);
    utils.book_append_sheet(wb, ws, "Data");
    helps?.forEach((help, index) => {
        let nn = utils.json_to_sheet(help)
        utils.book_append_sheet(wb, nn, `Help${index + 1}`);
    })
    const file = writeFileXLSX(wb, `${fileName}.xlsx`);
    return file
}
