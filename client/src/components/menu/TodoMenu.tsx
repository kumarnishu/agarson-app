import styled from '@emotion/styled';
import { Menu, MenuItem } from '@mui/material'
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TodoMenuActions, MenuContext } from '../../contexts/menuContext';
import { paths } from '../../Routes';


export const StyledLink = styled(Link)`
    text-decoration: none;
    color:black;
`

function TodoMenu() {
    const { menu, setMenu } = useContext(MenuContext)
    return (
        <Menu
            anchorEl={menu?.anchorEl}
            open={Boolean(menu?.type === TodoMenuActions.todo_menu)}
            onClose={() => setMenu({ type: TodoMenuActions.close_todo_menu, anchorEl: null })}
        >
            <MenuItem
                onClick={
                    () => setMenu({ type: TodoMenuActions.close_todo_menu, anchorEl: null })
                }>
                <StyledLink to={paths.todos}>Todos</StyledLink>
            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: TodoMenuActions.close_todo_menu, anchorEl: null })
                }>
                <StyledLink to={paths.todo_admin_page}>Admin</StyledLink>

            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: TodoMenuActions.close_todo_menu, anchorEl: null })
                }>
                <StyledLink to={paths.todo_help_page}>Help</StyledLink>
            </MenuItem>
        </Menu>
    )
}

export default TodoMenu