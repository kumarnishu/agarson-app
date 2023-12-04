import styled from '@emotion/styled';
import { Menu, MenuItem } from '@mui/material'
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BotMenuActions, MenuContext } from '../../contexts/menuContext';
import { paths } from '../../Routes';


export const StyledLink = styled(Link)`
    text-decoration: none;
    color:black;
`

function BotMenu() {
    const { menu, setMenu } = useContext(MenuContext)
    return (
        <Menu
            anchorEl={menu?.anchorEl}
            open={Boolean(menu?.type === BotMenuActions.bot_menu)}
            onClose={() => setMenu({ type: BotMenuActions.close_bot_menu, anchorEl: null })}
        >
            <MenuItem
                onClick={
                    () => setMenu({ type: BotMenuActions.close_bot_menu, anchorEl: null })
                }>
                <StyledLink to={paths.flows}>Flows</StyledLink>
            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: BotMenuActions.close_bot_menu, anchorEl: null })
                }>
                <StyledLink to={paths.chats}>Chats</StyledLink>

            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: BotMenuActions.close_bot_menu, anchorEl: null })
                }>
                <StyledLink to={paths.trackers}>Trackers</StyledLink>

            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: BotMenuActions.close_bot_menu, anchorEl: null })
                }>
                <StyledLink to={paths.bot_help}>Help</StyledLink>
            </MenuItem>
        </Menu>
    )
}

export default BotMenu