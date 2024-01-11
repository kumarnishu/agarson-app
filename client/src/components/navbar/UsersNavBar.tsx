import { Link, Outlet } from 'react-router-dom';
import { Stack } from '@mui/system';
import styled from '@emotion/styled';
import { Box, Paper, Typography } from '@mui/material';
import { paths } from '../../Routes';
import AgarsonLogo, { BlueAgarsonLogo } from '../logo/Agarson';
import ProfileLogo from '../logo/ProfileLogo';


export const StyledLink = styled(Link)`
    text-decoration: none;
    color:white;
`
export default function UsersNavBar() {
   
    return (
        <>
            <Box sx={{ bgcolor: 'rgba(0,0,255,0.7)', width: '100%', p: 0.6 }}>
                {/* parent stack */}
                <Stack direction="row" sx={{
                    justifyContent: "space-between", alignItems: "center"
                }}
                >
                    {/* child stack1 */}
                    <Stack direction="row" gap={2} pl={1}>
                        <StyledLink to={paths.dashboard}>
                            <AgarsonLogo width={35} height={35} title='Go To Dashboard' />
                        </StyledLink>

                    </Stack>
                    {/* child stack2 */}
                    <Stack direction="row"
                        justifyContent={"center"}
                        alignItems="center"
                    >

                        <Stack
                            direction="row"
                            justifyContent={"center"}
                            alignItems="center"
                            gap={2}
                        >

                            <Link to={paths.user_dashboard} replace={true} style={{ textDecoration: 'none' }}>
                                <Paper sx={{ bgcolor: 'white', boxShadow: 1, border: 10, borderRadius: 1, borderColor: 'white' }}>
                                    <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                                        <BlueAgarsonLogo width={20} height={20} title='users' />
                                        <Typography variant="button" sx={{ fontSize: 12 }} component="div">
                                            users
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Link>
                            <ProfileLogo />
                        </Stack>

                    </Stack>
                </Stack>
            </Box >
            <Outlet />
        </>
    )
}