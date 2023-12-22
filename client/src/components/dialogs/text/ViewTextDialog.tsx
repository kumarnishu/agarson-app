import { Dialog, DialogContent } from '@mui/material'



function ViewTextDialog({ text, display, setDisplay }: { text: string, display: boolean, setDisplay: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <Dialog open={Boolean(display)}
            fullWidth
            onClose={() => setDisplay(false)}
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
