import { Dialog, DialogContent } from '@mui/material'



function ViewTextDialog({ text, setText }: { text: string, setText: React.Dispatch<React.SetStateAction<string | undefined>> }) {
    return (
        <Dialog open={Boolean(text)}
            fullWidth
            onClose={() => setText(undefined)}
        >

            <DialogContent>
                <p style={{ fontSize: '14px',wordSpacing:'2px' }} >
                    {text}
                </p>

            </DialogContent>

        </Dialog >
    )
}

export default ViewTextDialog
