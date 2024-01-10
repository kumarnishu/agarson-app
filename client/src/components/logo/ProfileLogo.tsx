import { Avatar, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { useContext, useEffect } from 'react'
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { UserMenuActions, MenuContext } from '../../contexts/menuContext';
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext';
import { paths } from '../../Routes';
import NewUserDialog from '../dialogs/users/NewUserDialog';
import EmailVerifySendMailDialog from '../dialogs/users/EmailVerifySendMailDialog';
import UpdateProfileDialog from '../dialogs/users/UpdateProfileDialog';
import UpdatePasswordDialog from '../dialogs/users/UpdatePasswordDialog';
import { Logout } from '../../services/UserServices';
import { UserContext } from '../../contexts/userContext';
import ProfileDialog from '../dialogs/users/ProfileDialog';


function ProfileMenu() {
    const { menu, setMenu } = useContext(MenuContext)
    const { user, setUser } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess } = useMutation(Logout)
    const goto = useNavigate()
    useEffect(() => {
        if (isSuccess) {
            setUser(undefined)
            setChoice({ type: UserChoiceActions.close_user })
            setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })
            goto(paths.login)
        }
    }, [setUser, goto, setChoice, setMenu, isSuccess])
    return (
        <>
            {/* new user dialog */}
            <NewUserDialog />
            <Menu
                anchorEl={menu?.anchorEl}
                open={Boolean(menu?.type === UserMenuActions.profile_menu)}
                onClose={() => setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })}
            >
                <MenuItem
                    onClick={() => {
                        goto(paths.dashboard)
                        setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })
                    }
                    }
                >Dashboard</MenuItem>

                <MenuItem
                    onClick={() => {
                        setChoice({ type: UserChoiceActions.view_profile })
                        setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })
                    }
                    }

                >View Profile</MenuItem>
                <MenuItem
                    onClick={() => {
                        setChoice({ type: UserChoiceActions.update_profile })
                        setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })
                    }
                    }

                >Update Profile</MenuItem>

                <MenuItem onClick={() => {
                    setChoice({ type: UserChoiceActions.update_password })
                    setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })
                }}>
                    Update Password
                </MenuItem>

                {
                    !user?.email_verified ?

                        <MenuItem onClick={() => {
                            setChoice({ type: UserChoiceActions.verify_email })
                            setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })
                        }}>
                            Verify Email
                        </MenuItem>
                        : null
                }
                <MenuItem>
                    <Button fullWidth color="error" variant="outlined"
                        onClick={
                            () => {
                                mutate()
                                setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })
                            }
                        }
                    >
                        Logout
                    </Button>
                </MenuItem>
            </Menu>
            <EmailVerifySendMailDialog />
            <UpdateProfileDialog />
            <UpdatePasswordDialog />
            {user && <ProfileDialog profile={user} />}
        </>
    )
}


function ProfileLogo() {
    const { user } = useContext(UserContext)
    const { setMenu } = useContext(MenuContext)
    return (
        <>
            <Tooltip title={user?.username || "open settings"}>
                <IconButton
                    sx={{ border: 2, p: 0,mr:1, borderColor: 'white' }}
                    onClick={(e) => setMenu({ type: UserMenuActions.profile_menu, anchorEl: e.currentTarget })
                    }
                >
                    <Avatar
                        sx={{ width: 34, height: 34 }}
                        alt="img1" src={user?.dp?.public_url} />
                </IconButton>
            </Tooltip>
            <ProfileMenu />
        </>
    )
}

export default ProfileLogo