import styled from '@emotion/styled';
import { Menu, MenuItem } from '@mui/material'
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserMenuActions, MenuContext } from '../../contexts/menuContext';
import { paths } from '../../Routes';
import { UserContext } from '../../contexts/userContext';


export const StyledLink = styled(Link)`
    text-decoration: none;
    color:black;
`

function UserMenu() {
    const { user } = useContext(UserContext)
    const { menu, setMenu } = useContext(MenuContext)
    return (
        <Menu
            anchorEl={menu?.anchorEl}
            open={Boolean(menu?.type === UserMenuActions.user_menu)}
            onClose={() => setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })}
        >
            <MenuItem
                onClick={
                    () => setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })
                }>
                <StyledLink to={paths.users}>Users</StyledLink>
            </MenuItem>

            {user?.is_admin && <MenuItem
                onClick={
                    () => setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })
                }>
                <StyledLink to={paths.users_reports}>Access</StyledLink>

            </MenuItem>}
           
            <MenuItem
                onClick={
                    () => setMenu({ type: UserMenuActions.close_user_menu, anchorEl: null })
                }>
                <StyledLink to={paths.users_help}>Help</StyledLink>
            </MenuItem>
        </Menu>
    )
}

export default UserMenu