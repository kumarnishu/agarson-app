import { Button, Popover } from '@mui/material';
import { useState } from 'react'

function PopUp({ element }: { element: JSX.Element }) {
    const [popup, setPopup] = useState<any | null>(null);
    return (
        <div>
            <Button size="small" variant='text' color='inherit' onClick={(e) => setPopup(e.currentTarget)}>
                🔁 actions
            </Button>
            <Popover
                open={Boolean(popup)}
                anchorEl={popup}
                onClose={() =>
                    setPopup(null)
                }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {element}
            </Popover>
        </div >
    )
}

export default PopUp