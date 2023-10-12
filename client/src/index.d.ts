export type Target = EventTarget & (HTMLTextAreaElement | HTMLInputElement)
    & {
        files?: FileList | null
    }

export type BackendError = {
    response: { data: { message: string } }
}
