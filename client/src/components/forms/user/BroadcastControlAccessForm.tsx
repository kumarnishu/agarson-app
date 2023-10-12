import { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Button, Checkbox, FormControlLabel, Typography, CircularProgress, Stack } from '@mui/material'
import { queryClient } from '../../../main';
import { BackendError } from '../../..';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types';
import { UpdateUserBroadcastAccess } from '../../../services/UserServices';
import { BroadcastField, BroadcastFieldType } from '../../../types/access.types';



function BroadcastControlAccessForm({ user }: { user: IUser }) {
    const { setChoice } = useContext(ChoiceContext)
    const [BroadcastFields, setBroadcastFields] = useState(user.broadcast_fields)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<any>, BackendError, { id: string, broadcastFields: { broadcast_fields: BroadcastField[] } }>
        (UpdateUserBroadcastAccess, {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
            }
        })
    function handleHidden(key: BroadcastFieldType) {
        let newFields = BroadcastFields
        newFields = BroadcastFields.map((item) => {
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
        setBroadcastFields(newFields)
    }
    function handleReadOnly(key: BroadcastFieldType) {
        let newFields = BroadcastFields
        newFields = BroadcastFields.map((item) => {
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
        setBroadcastFields(newFields)
    }

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: UserChoiceActions.close_user })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <>

            <Stack p={2} direction={"column"} sx={{ maxWidth: '300px' }} gap={1}>
                <Typography variant={"subtitle1"} sx={{ fontWeight: "bold" }}>Broadcasts Options</Typography>

                {
                    BroadcastFields.map((field, index) => {
                        return (
                            <Stack key={index} direction="column" justifyContent={"left"}>
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


                <Stack gap={2} p={2} direction={"row"} alignItems={"center"} justifyContent={"center"}>
                    <Button size={"small"} variant="contained" color="primary"
                        onClick={() => {
                            mutate({ id: user._id, broadcastFields: { broadcast_fields: BroadcastFields } })
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            "Save"}
                    </Button>
                    <Button size={"small"} variant="outlined" color="primary"
                        onClick={() => {
                            setChoice({ type: UserChoiceActions.close_user })
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            "Cancel"}
                    </Button>
                </Stack>
            </Stack>

        </>
    )
}

export default BroadcastControlAccessForm