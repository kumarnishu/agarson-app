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
            <Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
                <Paper sx={{ maxWidth: '350px', pb: 2, px: 2, borderRadius: 10 }}>
                    <Stack justifyContent={"center"} alignItems="center">
                        <a href="https://agarsonshoes.in/">
                            <AgarsonPngLogo width={150} height={150} title='Agarson Shoes' />
                        </a>
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
                    </Stack>
                </Paper>
            </Stack>
            <Stack flexDirection="column" sx={{ width: '100%', position: 'absolute', bottom: 1, alignText: 'center', justifyContent: 'center', p: 2 }}
            >
                <Typography component="h1" variant="button" sx={{ textAlign: "center", fontWeight: '600', fontSize: 12, pt: 4, color: 'grey' }}>Copyright &copy; Agarson Shoes Pvt Ltd </Typography>
            </Stack>
            <SignUpDialog />
            <ResetPasswordSendMailDialog />
        </>
    )
}

export default LoginPage
