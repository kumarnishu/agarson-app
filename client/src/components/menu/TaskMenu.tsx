import styled from '@emotion/styled';
import { Menu, MenuItem } from '@mui/material'
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TaskMenuActions, MenuContext } from '../../contexts/menuContext';
import { paths } from '../../Routes';


export const StyledLink = styled(Link)`
    text-decoration: none;
    color:black;
`

function TaskMenu() {
    const { menu, setMenu } = useContext(MenuContext)
    return (
        <Menu
            anchorEl={menu?.anchorEl}
            open={Boolean(menu?.type === TaskMenuActions.task_menu)}
            onClose={() => setMenu({ type: TaskMenuActions.close_task_menu, anchorEl: null })}
        >
            <MenuItem
                onClick={
                    () => setMenu({ type: TaskMenuActions.close_task_menu, anchorEl: null })
                }>
                <StyledLink to={paths.tasks}>tasks</StyledLink>
            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: TaskMenuActions.close_task_menu, anchorEl: null })
                }>
                <StyledLink to={paths.task_admin_page}>Admin</StyledLink>

            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: TaskMenuActions.close_task_menu, anchorEl: null })
                }>
                <StyledLink to={paths.task_help_page}>Help</StyledLink>
            </MenuItem>
        </Menu>
    )
}

export default TaskMenu