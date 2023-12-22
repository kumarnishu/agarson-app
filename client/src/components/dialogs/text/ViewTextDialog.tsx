import { Dialog, DialogContent, IconButton } from '@mui/material'
import { Cancel } from '@mui/icons-material';



function ViewTextDialog({ text, display, setDisplay }: { text: string, display: boolean, setDisplay: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <Dialog open={Boolean(display)}
            fullWidth
            onClose={() => setDisplay(false)}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setDisplay(false)}>
                <Cancel fontSize='large' />
            </IconButton>

            <DialogContent>
                <pre style={{ fontSize: '16px' }} color="error">
                    {text}
                </pre>

            </DialogContent>

        </Dialog >
    )
}

export default ViewTextDialog
