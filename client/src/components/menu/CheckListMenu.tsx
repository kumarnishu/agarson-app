import styled from '@emotion/styled';
import { Menu, MenuItem } from '@mui/material'
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CheckListMenuActions, MenuContext } from '../../contexts/menuContext';
import { paths } from '../../Routes';


export const StyledLink = styled(Link)`
    text-decoration: none;
    color:black;
`

function CheckListMenu() {
    const { menu, setMenu } = useContext(MenuContext)
    return (
        <Menu
            anchorEl={menu?.anchorEl}
            open={Boolean(menu?.type === CheckListMenuActions.checklist_menu)}
            onClose={() => setMenu({ type: CheckListMenuActions.close_checklist_menu, anchorEl: null })}
        >
            <MenuItem
                onClick={
                    () => setMenu({ type: CheckListMenuActions.close_checklist_menu, anchorEl: null })
                }>
                <StyledLink to={paths.checklists}>Checklists</StyledLink>
            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: CheckListMenuActions.close_checklist_menu, anchorEl: null })
                }>
                <StyledLink to={paths.checklist_admin_page}>Admin</StyledLink>

            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: CheckListMenuActions.close_checklist_menu, anchorEl: null })
                }>
                <StyledLink to={paths.checklist_help_page}>Help</StyledLink>
            </MenuItem>
        </Menu>
    )
}

export default CheckListMenu