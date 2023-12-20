import styled from '@emotion/styled';
import { Menu, MenuItem } from '@mui/material'
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PasswordMenuActions, MenuContext } from '../../contexts/menuContext';
import { paths } from '../../Routes';
import { UserContext } from '../../contexts/userContext';


export const StyledLink = styled(Link)`
    text-decoration: none;
    color:black;
`

function PasswordMenu() {
    const { user } = useContext(UserContext)
    const { menu, setMenu } = useContext(MenuContext)
    return (
        <Menu
            anchorEl={menu?.anchorEl}
            open={Boolean(menu?.type === PasswordMenuActions.password_menu)}
            onClose={() => setMenu({ type: PasswordMenuActions.close_password_menu, anchorEl: null })}
        >
            <MenuItem
                onClick={
                    () => setMenu({ type: PasswordMenuActions.close_password_menu, anchorEl: null })
                }>
                <StyledLink to={paths.passwords}>Passwords</StyledLink>
            </MenuItem>
            {user?.is_admin && <MenuItem
                onClick={
                    () => setMenu({ type: PasswordMenuActions.close_password_menu, anchorEl: null })
                }>
                <StyledLink to={paths.password_admin_page}>Admin</StyledLink>

            </MenuItem>}
            <MenuItem
                onClick={
                    () => setMenu({ type: PasswordMenuActions.close_password_menu, anchorEl: null })
                }>
                <StyledLink to={paths.password_help_page}>Help</StyledLink>
            </MenuItem>
        </Menu>
    )
}

export default PasswordMenu