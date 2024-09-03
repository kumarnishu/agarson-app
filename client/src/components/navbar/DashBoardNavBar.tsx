import { Link, Outlet } from 'react-router-dom';
import { Stack } from '@mui/system';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
import { paths } from '../../Routes';
import AgarsonLogo from '../logo/Agarson';
import ProfileLogo from '../logo/ProfileLogo';

export const StyledLink = styled(Link)`
    text-decoration: none;
    color:white;
`
export default function DashBoardNavBar() {
    const { user } = useContext(UserContext)
    return (
        <>
            <Box sx={{ bgcolor: 'blue', width: '100%', p: 2 }}>
                {/* parent stack */}
                <Stack direction="row" sx={{
                    justifyContent: "space-between", alignItems: "center"
                }}
                >
                    {/* child stack1 */}
                    <Stack direction="row" gap={2} pl={1}>
                        <StyledLink to={paths.dashboard} replace={true}>
                            <AgarsonLogo width={35} height={35} title='Go To Dashboard' />
                        </StyledLink>
                        <StyledLink to={paths.dashboard} replace={true}>
                            <Typography component={"h1"} sx={{ fontWeight: 600, fontSize: 20, color: 'white' }} variant="button">
                                Dashboard
                            </Typography>
                        </StyledLink>
                    </Stack>
                    {/* child stack2 */}
                    <Stack direction="row"
                        justifyContent={"center"}
                        alignItems="center"
                    >
                        {user ?
                            <>
                                {/* stack1 nav links*/}
                                <Stack
                                    direction="row"
                                    gap={2}
                                    px={2}
                                    sx={{
                                        display: { xs: 'none', md: 'flex' }
                                    }}
                                >
                                </Stack>

                                {/* stack2 right icons*/}
                                <Stack
                                    direction="row"
                                    justifyContent={"space-around"}
                                    alignItems="center"
                                    gap={1}
                                >
                                    <ProfileLogo />
                                </Stack>
                            </>
                            :
                            null
                        }
                    </Stack >
                </Stack>
            </Box >
            <Outlet />
        </>
    )
}