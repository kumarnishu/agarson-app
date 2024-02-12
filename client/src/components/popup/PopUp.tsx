import { AdsClickOutlined } from '@mui/icons-material';
import { Popover } from '@mui/material';
import { useState } from 'react'

function PopUp({ element, color }: { element: JSX.Element, color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" }) {
    const [popup, setPopup] = useState<any | null>(null);
    return (
        <div>
            <AdsClickOutlined color={color || "primary"} sx={{margin:1}} onClick={(e) => setPopup(e.currentTarget)} />
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