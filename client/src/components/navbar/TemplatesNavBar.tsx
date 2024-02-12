import { Link, Outlet } from 'react-router-dom';
import { Stack } from '@mui/system';
import styled from '@emotion/styled';
import { Box, Paper, Typography } from '@mui/material';
import AgarsonLogo from '../logo/Agarson';
import AppsIcon from '@mui/icons-material/Apps';
import { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
import { paths } from '../../Routes';
import ProfileLogo from '../logo/ProfileLogo';

export const StyledLink = styled(Link)`
    text-decoration: none;
    color:white;
`
export default function TemplatesNavBar() {
    const { user } = useContext(UserContext)
    return (
        <>
            <Box sx={{ bgcolor: 'rgba(0,0,255,0.7)', width: '100%', p: 0.6 }}>
                {/* parent stack */}
                <Stack direction="row" sx={{
                    justifyContent: "space-between", alignItems: "center"
                }}
                >
                    {/* child stack1 */}
                    <Stack direction="row" gap={2} pl={3}>
                        <StyledLink to={paths.dashboard} replace={true}>
                            <AgarsonLogo width={35} height={35} title='Go To Dashboard' />
                        </StyledLink>
                      
                    </Stack>
                    {/* child stack2 */}
                    <Stack direction="row"
                        justifyContent={"center"}
                        alignItems="center"
                    >
                        {user ?
                            <>
                              

                                {/* stack2 right icons*/}
                                <Stack
                                    direction="row"
                                    justifyContent={"center"}
                                    alignItems="center"
                                    gap={2}
                                >  <Link to={paths.templates_dashboard} replace={true} style={{ textDecoration: 'none' }}>
                                        <Paper sx={{ bgcolor: 'white', boxShadow: 1, border: 10, borderRadius: 1, borderColor: 'white' }}>
                                            <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                                                <AppsIcon fontSize={'large'} />
                                                <Typography variant="button" sx={{ fontSize: 12 }} component="div">
                                                    templates
                                                </Typography>
                                            </Stack>
                                        </Paper>
                                    </Link>
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