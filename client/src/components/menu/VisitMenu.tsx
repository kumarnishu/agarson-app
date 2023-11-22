import styled from '@emotion/styled';
import { Menu, MenuItem } from '@mui/material'
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { VisitMenuActions, MenuContext } from '../../contexts/menuContext';
import { paths } from '../../Routes';


export const StyledLink = styled(Link)`
    text-decoration: none;
    color:black;
`

function VisitMenu() {
    const { menu, setMenu } = useContext(MenuContext)
    return (
        <Menu
            anchorEl={menu?.anchorEl}
            open={Boolean(menu?.type === VisitMenuActions.visit_menu)}
            onClose={() => setMenu({ type: VisitMenuActions.close_visit_menu, anchorEl: null })}
        >
            <MenuItem
                onClick={
                    () => setMenu({ type: VisitMenuActions.close_visit_menu, anchorEl: null })
                }>
                <StyledLink to={paths.visit}>My Visit</StyledLink>
            </MenuItem>
        
            <MenuItem
                onClick={
                    () => setMenu({ type: VisitMenuActions.close_visit_menu, anchorEl: null })
                }>
                <StyledLink to={paths.visit_help}>Help</StyledLink>
            </MenuItem>
        </Menu>
    )
}

export default VisitMenu