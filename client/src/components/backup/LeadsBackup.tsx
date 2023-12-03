import { Button, Snackbar, Stack } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/userContext'
import { saveAs } from 'file-saver';

function LeadsBackup() {
    const [value, setValue] = useState<string>()
    const { user } = useContext(UserContext)
    const [sent, setSent] = useState(false)

    function HandleExport() {
        if (value) {
            saveAs(`/api/v1/backup/leads?value=${value}`, "leads_backup.xlsx")
            setSent(true)
        }
    }
    useEffect(() => {
        if (value) HandleExport()
    }, [value])

    return (
        <>
            {/* export snak bar */}
            <Snackbar
                open={sent}
                autoHideDuration={6000}
                onClose={() => setSent(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                message="File Exported Successfuly"
            />

            <Stack direction="row" gap={1} alignItems="center">
                {user?.is_admin ?
                    <>
                        <Button variant='outlined' disabled={!user.backup_access_fields.is_deletion_allowed} onClick={() => {
                            setValue("leads")

                        }}>Export</Button>
                        <Button variant='contained' disabled={!user.backup_access_fields.is_deletion_allowed} onClick={() => {
                            setValue("mobiles")

                        }}
                        >Extract Mobiles</Button>
                    </> :
                    null}
            </Stack>
        </>
    )
}

export default LeadsBackup