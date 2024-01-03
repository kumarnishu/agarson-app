import styled from '@emotion/styled';
import { Menu, MenuItem } from '@mui/material'
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductionMenuActions, MenuContext } from '../../contexts/menuContext';
import { paths } from '../../Routes';
import { UserContext } from '../../contexts/userContext';


export const StyledLink = styled(Link)`
    text-decoration: none;
    color:black;
`

function ProductionMenu() {
    const { menu, setMenu } = useContext(MenuContext)
    const { user } = useContext(UserContext)
    return (
        <Menu
            anchorEl={menu?.anchorEl}
            open={Boolean(menu?.type === ProductionMenuActions.production_menu)}
            onClose={() => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })}
        >
            <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.my_production}>My Production</StyledLink>
            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.my_shoe_weight}>My Shoe Weight</StyledLink>
            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.my_running_mould}>My Running Mould</StyledLink>
            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.my_dye_repair}>My Dye Repair</StyledLink>
            </MenuItem>

            {user?.is_admin && <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.shoe_weight}>Shoe Weights</StyledLink>
            </MenuItem>}
            {user?.is_admin && <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.running_mould}>Running Mould</StyledLink>
            </MenuItem>}
            {user?.is_admin && <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.dye_repair}>Dye Repair</StyledLink>
            </MenuItem>}

            {user?.is_admin && <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.articles}>Articles</StyledLink>
            </MenuItem>}
            {user?.is_admin && <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.dyes}>Dyes</StyledLink>
            </MenuItem>}

            {user?.is_admin && <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.machines}>Machines</StyledLink>
            </MenuItem>}
            {user?.is_admin && <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.production}>Production</StyledLink>
            </MenuItem>}
            <MenuItem
                onClick={
                    () => setMenu({ type: ProductionMenuActions.close_production_menu, anchorEl: null })
                }>
                <StyledLink to={paths.production_help_page}>Help</StyledLink>
            </MenuItem>
        </Menu>
    )
}

export default ProductionMenu