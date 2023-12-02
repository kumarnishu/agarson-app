import { Typography, Stack, Paper } from '@mui/material'
import { useContext } from 'react';
import ResetPasswordSendMailDialog from '../../components/dialogs/users/ResetPasswordSendMailDialog';
import SignUpDialog from '../../components/dialogs/users/SignUpDialog';
import LoginForm from '../../components/forms/user/LoginForm';
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext';
import { AgarsonPngLogo } from '../../components/logo/Agarson';


function LoginPage() {
    const { setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{ minHeight: "100vh", minWidth: '80vw', backgroundColor: 'rgba(0,0,150,0.8)' }}>
                <Paper
                    sx={{
                        spacing: 2,
                        padding: 2,
                        borderRadius: 2
                    }}
                    elevation={1}>
                    <Stack justifyContent={"center"} alignItems="center">
                        <a href="https://agarsonshoes.in/">
                            <AgarsonPngLogo width={150} height={150} title='Agarson Shoes' />
                        </a>
                    </Stack>
                    <LoginForm />
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        gap={1}
                        pt={3}
                        direction={"row"}
                    >
                        <Typography
                            variant="body1"
                            sx={{ cursor: "pointer" }}
                            component="span"
                            onClick={() => setChoice({ type: UserChoiceActions.signup })}
                        >
                            <b>Register</b>
                        </Typography >
                        {" or "}
                        <Typography
                            variant="body1"
                            sx={{ cursor: "pointer" }}
                            component="span"
                            onClick={() => setChoice({ type: UserChoiceActions.reset_password_mail })}
                        >
                            Forgot Password
                        </Typography >

                    </Stack>
                </Paper>
                <Stack sx={{ width: '100%', alignText: 'center', p: 2 }}
                >
                    <Typography component="h1" variant="h4" sx={{ textAlign: "center", color: 'whitesmoke', fontWeight: 'bold', fontSize: 18, pt: 4 }}>Copyright &copy; Agarson Shoes Pvt Ltd </Typography>
                </Stack>
                <Typography variant="caption" component="p"  ><a style={{ textAlign: "center", fontWeight: '400', color: 'whitesmoke' }} href="https://github.com/kumarnishu">Developer : Nishu kumar 91-7056943283</a></Typography>

            </Stack>
            <SignUpDialog />
            <ResetPasswordSendMailDialog />
        </>
    )
}

export default LoginPage
