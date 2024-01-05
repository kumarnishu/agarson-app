import { Dialog, DialogContent } from '@mui/material'



function ViewTextDialog({ text, setText, wrap }: { wrap?: boolean, text: string, setText: React.Dispatch<React.SetStateAction<string | undefined>> }) {
    return (
        <Dialog open={Boolean(text)}
            fullWidth
            onClose={() => setText(undefined)}
        >

            <DialogContent>
                {wrap ?
                    <p style={{ fontSize: '14px', wordSpacing: '2px' }} >
                        {text}
                    </p> :
                    <pre style={{ fontSize: '14px', wordSpacing: '2px' }} >
                        {text}
                    </pre>
                }


            </DialogContent>

        </Dialog >
    )
}

export default ViewTextDialog
