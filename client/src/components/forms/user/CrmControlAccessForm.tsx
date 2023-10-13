import { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { UpdateUserLeadAccess } from '../../../services/UserServices';
import { Button, Checkbox, FormControlLabel, Typography, CircularProgress, Stack } from '@mui/material'
import { queryClient } from '../../../main';
import { BackendError } from '../../..';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { LeadField, LeadFieldType } from '../../../types/access.types';



function CrmControlAccessForm({ user }: { user: IUser }) {
    const { setChoice } = useContext(ChoiceContext)
    const [LeadFields, setLeadFields] = useState(user.lead_fields)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<any>, BackendError, { id: string, leadFields: { lead_fields: LeadField[] } }>
        (UpdateUserLeadAccess, {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
            }
        })
    function handleHidden(key: LeadFieldType) {
        let newFields = LeadFields
        newFields = LeadFields.map((item) => {
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
        setLeadFields(newFields)
    }
    function handleReadOnly(key: LeadFieldType) {
        let newFields = LeadFields
        newFields = LeadFields.map((item) => {
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
        setLeadFields(newFields)
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
                <Typography variant={"button"} sx={{ fontWeight: "bold" }}>Crm Options</Typography>
                <FormControlLabel sx={{ fontSize: 12 }} control={<Checkbox size="small"  />} onChange={() => {
                }}label="Select All" />
                {
                    LeadFields.map((field, index) => {
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
                        <AlertBar message=" Access For selected user updated successfully" color="success" />
                    ) : null
                }


                <Stack gap={2} p={2} direction={"row"} alignItems={"center"} justifyContent={"center"}>
                    <Button size={"small"} variant="contained" color="primary"
                        onClick={() => {
                            mutate({ id: user._id, leadFields: { lead_fields: LeadFields } })
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

export default CrmControlAccessForm