import styled from '@emotion/styled';
import { Menu, MenuItem } from '@mui/material'
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CrmMenuActions, MenuContext } from '../../contexts/menuContext';
import { paths } from '../../Routes';


export const StyledLink = styled(Link)`
    text-decoration: none;
    color:black;
`

function CrmMenu() {
    const { menu, setMenu } = useContext(MenuContext)
    const goto = useNavigate()
    return (
        <Menu
            anchorEl={menu?.anchorEl}
            open={Boolean(menu?.type === CrmMenuActions.crm_menu)}
            onClose={() => setMenu({ type: CrmMenuActions.close_crm_menu, anchorEl: null })}
        >
            <MenuItem
                onClick={
                    () => setMenu({ type: CrmMenuActions.close_crm_menu, anchorEl: null })
                }>
                <StyledLink to={paths.lead_reports}>Reports</StyledLink>
            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: CrmMenuActions.close_crm_menu, anchorEl: null })
                }>
                <StyledLink to={paths.leads}>Leads</StyledLink>
            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: CrmMenuActions.close_crm_menu, anchorEl: null })
                }>
                <StyledLink to={paths.customers}>Customers</StyledLink>
            </MenuItem>

            <MenuItem
                onClick={
                    () => setMenu({ type: CrmMenuActions.close_crm_menu, anchorEl: null })
                }>
                <StyledLink to={paths.refers}>Refers</StyledLink>
            </MenuItem>

            <MenuItem
                onClick={
                    () => setMenu({ type: CrmMenuActions.close_crm_menu, anchorEl: null })
                }>
                <StyledLink to={paths.updateble_fields_lead}>Fields</StyledLink>
            </MenuItem>
            <MenuItem
                onClick={
                    () => setMenu({ type: CrmMenuActions.close_crm_menu, anchorEl: null })
                }>
                <StyledLink to={paths.useless_leads}>Useless</StyledLink>
            </MenuItem>
            <MenuItem
                onClick={
                    () => goto(paths.crm_help)
                }>
                <StyledLink to={paths.crm_help}>Help</StyledLink>
            </MenuItem>
        </Menu>
    )
}

export default CrmMenu