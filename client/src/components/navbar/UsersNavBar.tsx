import { Link, Outlet } from 'react-router-dom';
import { Stack } from '@mui/system';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { paths } from '../../Routes';
import AgarsonLogo from '../logo/Agarson';
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

                            <StyledLink to={paths.user_dashboard}>
                                <Stack flexDirection={'row'} gap={2}>
                                    <HomeIcon sx={{ height: 30, width: 30 }} />

                                    <Typography component={"h1"} sx={{ fontWeight: 600, fontSize: 20, color: 'white' }} variant="button">
                                        Users
                                    </Typography>
                                </Stack>
                            </StyledLink>
                            <ProfileLogo />
                        </Stack>

                    </Stack>
                </Stack>
            </Box >
            <Outlet />
        </>
    )
}