import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton, TextField } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { CreateDepartment } from '../../../services/UserServices';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';


function CreateDepartmentDialog() {
    const [department, setDepartment] = useState<string>()
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, { department: string }>
        (CreateDepartment, {
            onSuccess: () => {
                queryClient.invalidateQueries('departments')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: UserChoiceActions.close_user })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <Dialog open={choice === UserChoiceActions.create_department ? true : false}
            onClose={() => setChoice({ type: UserChoiceActions.close_user })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
                <Cancel fontSize='large' />
            </IconButton>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message=" successfull" color="success" />
                ) : null
            }
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                New Department
            </DialogTitle>


            <DialogContent>
                <Typography sx={{ p: 2 }} variant="body1" color="error">
                    Warning ! This will create new department
                </Typography>
                <TextField
                    required
                    fullWidth
                    label="Department"
                    name="Department"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.currentTarget.value)}
                />
            </DialogContent>
            <Stack
                direction="column"
                gap={2}
                padding={2}
                width="100%"
            >
                <Button fullWidth variant="outlined" color="error"
                    onClick={() => {
                        if (department) {
                            mutate({ department: department })
                        }
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Create"}
                </Button>

            </Stack >
        </Dialog >
    )
}

export default CreateDepartmentDialog