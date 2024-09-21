import { useContext, useEffect } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/userContext'
import { Button } from '@mui/material'
import { Logout } from '../../services/UserServices'

function LogoutButton() {
    const { mutate, isSuccess } = useMutation(Logout)
    const goto = useNavigate()
    const { setUser } = useContext(UserContext)

    useEffect(() => {
        if (isSuccess) {
            setUser(undefined)
            goto("/Login")
        }
    }, [isSuccess])
    return (
        <Button fullWidth color="error" variant="outlined"
            onClick={
                () => {
                    mutate()
                }
            }
        >
            Logout
        </Button>
    )
}

export default LogoutButton