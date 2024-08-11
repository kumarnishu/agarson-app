import { Popover } from '@mui/material';
import { useState } from 'react'

function PopUp({ element }: { element: JSX.Element }) {
    const [popup, setPopup] = useState<any | null>(null);
    return (
        <div>
            <span style={{fontSize:'11px'}} onClick={(e) => setPopup(e.currentTarget)}>
                🔁 actions
            </span>
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