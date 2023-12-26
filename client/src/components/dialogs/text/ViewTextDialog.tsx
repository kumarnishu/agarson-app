import { Dialog, DialogContent } from '@mui/material'



function ViewTextDialog({ text, setText }: { text: string, setText: React.Dispatch<React.SetStateAction<string | undefined>> }) {
    return (
        <Dialog open={Boolean(text)}
            fullWidth
            onClose={() => setText(undefined)}
        >

            <DialogContent>
                <pre style={{ fontSize: '16px' }} color="error">
                    {text}
                </pre>

            </DialogContent>

        </Dialog >
    )
}

export default ViewTextDialog
