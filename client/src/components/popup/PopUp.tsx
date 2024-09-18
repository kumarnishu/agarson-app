import { AcUnitTwoTone } from '@mui/icons-material';
import { IconButton, Popover } from '@mui/material';
import { useState } from 'react'

function PopUp({ element }: { element: JSX.Element }) {
    const [popup, setPopup] = useState<any | null>(null);
    return (
        <div>
            <IconButton size="small" onClick={(e) => setPopup(e.currentTarget)}>
                <AcUnitTwoTone />
            </IconButton>
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