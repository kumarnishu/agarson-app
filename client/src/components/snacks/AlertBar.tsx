import { Alert, Snackbar } from '@mui/material'
import { useState } from 'react'


type Props = {
    message: string,
    color: "error" | "warning" | "success",
    variant?: "filled" | "outlined"
}
function AlertBar({ message, color, variant }: Props) {
    const [sent, setSent] = useState(Boolean(message))
    return (
        <Snackbar
            open={sent}
            color={color}
            autoHideDuration={6000}
            onClose={() => setSent(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            message={message}
        >
            <Alert variant={variant || "filled"} onClose={() => setSent(false)} severity={color} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>

    )
}

export default AlertBar