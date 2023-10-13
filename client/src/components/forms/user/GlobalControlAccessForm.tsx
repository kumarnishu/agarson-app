import { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { UpdateUserGlobalAccess } from '../../../services/UserServices';
import { Button, Checkbox, FormControlLabel, Typography, CircularProgress, Stack } from '@mui/material'
import { queryClient } from '../../../main';
import { BackendError } from '../../..';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { GlobalFeatureField, GlobalFeatureFieldType } from '../../../types/access.types';



function GlobalControlAccessForm({ user }: { user: IUser }) {
    const { setChoice } = useContext(ChoiceContext)
    const [GlobalFields, setGlobalFields] = useState(user.global_fields)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<any>, BackendError, { id: string, globalFields: { global_fields: GlobalFeatureField[] } }>
        (UpdateUserGlobalAccess, {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
            }
        })
    function handleHidden(key: GlobalFeatureFieldType) {
        let newFields = GlobalFields
        newFields = GlobalFields.map((item) => {
            if (item.field === key) {
                return ({
                    ...item,
                    hidden: !item.hidden
                })
            }
            else {
                return item
            }
        })
        setGlobalFields(newFields)
    }
    function handleReadOnly(key: GlobalFeatureFieldType) {
        let newFields = GlobalFields
        newFields = GlobalFields.map((item) => {
            if (item.field === key) {
                return ({
                    ...item,
                    readonly: !item.readonly
                })
            }
            else {
                return item
            }
        })
        setGlobalFields(newFields)
    }

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: UserChoiceActions.close_user })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <>

            <Typography variant={"subtitle1"} sx={{ fontWeight: "bold", textAlign: 'center' }}>Globals Options</Typography>
            <Stack p={2} direction={"row"} sx={{ maxWidth: '300px' }} gap={1}>

                {
                    GlobalFields.map((field, index) => {
                        return (
                            <Stack key={index} gap={2} sx={{ minWidth: '150px' }}>
                                <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>{field.field.replace("_", " ").toLocaleUpperCase()}</Typography>
                                <FormControlLabel sx={{ fontSize: 12 }} control={<Checkbox size="small" checked={Boolean(field.hidden)} />} onChange={() => {
                                    handleHidden(field.field)
                                }} label="Hidden" />
                                <FormControlLabel sx={{ fontSize: 12 }} control={<Checkbox size="small" checked={Boolean(field.readonly)} />}
                                    onChange={() => {
                                        handleReadOnly(field.field)
                                    }}
                                    label="Read Only"
                                />
                            </Stack>
                        )
                    })
                }

                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="   Access For selected user updated successfully" color="success" />
                    ) : null
                }
            </Stack>
            <Button fullWidth sx={{m:2}} variant="contained" color="primary"
                onClick={() => {
                    mutate({ id: user._id, globalFields: { global_fields: GlobalFields } })
                }}
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress /> :
                    "Save"}
            </Button>
            <Button fullWidth sx={{m:2}} variant="outlined" color="primary"
                onClick={() => {
                    setChoice({ type: UserChoiceActions.close_user })
                }}
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress /> :
                    "Cancel"}
            </Button>

        </>
    )
}

export default GlobalControlAccessForm