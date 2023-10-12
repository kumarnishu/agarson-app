import FileSaver from "file-saver"

export function DownloadFile(url: string, name: string) {
    if (url && name)
        FileSaver.saveAs(`${url}`, name)
}

