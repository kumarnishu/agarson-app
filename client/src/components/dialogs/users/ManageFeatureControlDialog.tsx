import { Box, Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material"
import { Cancel } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { IUser } from "../../../types/user.types"
import { Feature, FeatureAccess } from "../../../types/access.types"
import { useMutation, useQuery } from "react-query"
import { AxiosResponse } from "axios"
import { BackendError } from "../../.."
import { GetUsers, UpdateFeatureAccess } from "../../../services/UserServices"
import AlertBar from "../../snacks/AlertBar"
import { STable, STableBody, STableCell, STableHead, STableRow } from "../../styled/STyledTable"
import { queryClient } from "../../../main"

type TSelectedData = {
    user: string,
    access: FeatureAccess
}

function ManageFeatureControlDialog({ feature, setFeature }: { feature: string | undefined, setFeature: React.Dispatch<React.SetStateAction<string | undefined>> }) {
    let [selectedData, setSelectedData] = useState<TSelectedData[]>()
    const { data: usersData, isSuccess: isUserSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<any>, BackendError, {
            feature: string,
            body: {
                access: FeatureAccess,
                user: string
            }[]
        }>
        (UpdateFeatureAccess, {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
            }
        })

    useEffect(() => {
        if (isUserSuccess) {
            setSelectedData(usersData && usersData.data.map((user) => {
                return {
                    user: user._id, access: {
                        is_editable: user.user_access_fields.is_editable,
                        is_hidden: user.user_access_fields.is_hidden,
                        is_deletion_allowed: user.user_access_fields.is_deletion_allowed
                    }
                }
            }))

        }
    }, [isUserSuccess])

    useEffect(() => {
        if (isSuccess) {
            setFeature(undefined)
        }
    }, [isSuccess])
    
    return (
        <>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="Access For selected feature updated successfully" color="success" />
                ) : null
            }
            <Dialog fullScreen open={feature ? true : false}
                onClose={() => {
                    setFeature(undefined)
                    setSelectedData(undefined)
                }}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {

                    setFeature(undefined)
                }}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                    <Stack direction="row"
                        spacing={2}
                        alignItems={'center'}
                    >
                        <Typography variant="h6" p={1} sx={{ textTransform: 'uppercase', fontsize: 18, fontWeight: 'bold' }}>
                            {feature}
                        </Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>

                    <Box sx={{
                        overflow: "scroll",
                        height: '73.5vh',
                    }}>
                        <STable
                        >
                            <STableHead
                            >
                                <STableRow>
                                    <STableCell
                                    >
                                        <Stack
                                            direction="row"
                                            justifyContent="left"
                                            alignItems="left"
                                            spacing={2}
                                        >
                                            User
                                        </Stack>
                                    </STableCell>

                                    <STableCell
                                    >
                                        <Stack
                                            direction="row"
                                            justifyContent="left"
                                            alignItems="left"
                                            spacing={2}
                                        >
                                            Editor
                                        </Stack>
                                    </STableCell>

                                    <STableCell
                                    >
                                        <Stack
                                            direction="row"
                                            justifyContent="left"
                                            alignItems="left"
                                            spacing={2}
                                        >
                                            Hidden
                                        </Stack>
                                    </STableCell>

                                    <STableCell
                                    >
                                        <Stack
                                            direction="row"
                                            justifyContent="left"
                                            alignItems="left"
                                            spacing={2}
                                        >
                                            Delete
                                        </Stack>
                                    </STableCell>

                                    {/* visitin card */}
                                </STableRow>
                            </STableHead>
                            <STableBody >
                                {usersData && usersData.data.map((user, index) => {
                                    return (
                                        <STableRow
                                            key={index}
                                        >{feature === Feature.users &&
                                            <>
                                                <STableCell                 >
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="left"
                                                        alignItems="left"
                                                        spacing={2}
                                                    >
                                                        <Typography variant="button">{user.username}
                                                        </Typography>
                                                    </Stack>
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" defaultChecked={Boolean(user.user_access_fields.is_editable)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                let tmp = selectedData?.map((data) => {
                                                                    if (data.user === user._id)
                                                                        return {
                                                                            user: data.user,
                                                                            access: {
                                                                                is_editable: true,
                                                                                is_hidden: data.access.is_hidden,
                                                                                is_deletion_allowed: data.access.is_deletion_allowed
                                                                            }
                                                                        }
                                                                    return data
                                                                })
                                                                setSelectedData(tmp)
                                                            }
                                                            else {
                                                                let tmp = selectedData?.map((data) => {
                                                                    if (data.user === user._id)
                                                                        return {
                                                                            user: data.user,
                                                                            access: {
                                                                                is_editable: false,
                                                                                is_hidden: data.access.is_hidden,
                                                                                is_deletion_allowed: data.access.is_deletion_allowed
                                                                            }
                                                                        }
                                                                    return data
                                                                })
                                                                setSelectedData(tmp)
                                                            }
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" defaultChecked={Boolean(user.user_access_fields.is_hidden)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                let tmp = selectedData?.map((data) => {
                                                                    if (data.user === user._id)
                                                                        return {
                                                                            user: data.user,
                                                                            access: {
                                                                                is_editable: data.access.is_editable,
                                                                                is_hidden: true,
                                                                                is_deletion_allowed: data.access.is_deletion_allowed
                                                                            }
                                                                        }
                                                                    return data
                                                                })
                                                                setSelectedData(tmp)
                                                            }
                                                            else {
                                                                let tmp = selectedData?.map((data) => {
                                                                    if (data.user === user._id)
                                                                        return {
                                                                            user: data.user,
                                                                            access: {
                                                                                is_editable: data.access.is_editable,
                                                                                is_hidden: false,
                                                                                is_deletion_allowed: data.access.is_deletion_allowed
                                                                            }
                                                                        }
                                                                    return data
                                                                })
                                                                setSelectedData(tmp)
                                                            }
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" defaultChecked={Boolean(user.user_access_fields.is_deletion_allowed)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                let tmp = selectedData?.map((data) => {
                                                                    if (data.user === user._id)
                                                                        return {
                                                                            user: data.user,
                                                                            access: {
                                                                                is_editable: data.access.is_editable,
                                                                                is_hidden: data.access.is_hidden,
                                                                                is_deletion_allowed: true
                                                                            }
                                                                        }
                                                                    return data
                                                                })
                                                                setSelectedData(tmp)
                                                            }
                                                            else {
                                                                let tmp = selectedData?.map((data) => {
                                                                    if (data.user === user._id)
                                                                        return {
                                                                            user: data.user,
                                                                            access: {
                                                                                is_editable: data.access.is_editable,
                                                                                is_hidden: data.access.is_hidden,
                                                                                is_deletion_allowed: false
                                                                            }
                                                                        }
                                                                    return data
                                                                })
                                                                setSelectedData(tmp)
                                                            }
                                                        }}
                                                    />
                                                </STableCell>
                                            </>
                                            }
                                            {feature === Feature.crm &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.crm_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.crm_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.crm_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.productions &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.productions_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.productions_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.productions_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.checklists &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.checklists_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.checklists_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.checklists_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.tasks &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.tasks_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.tasks_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.tasks_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.todos &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.todos_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.todos_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.todos_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.broadcast &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.broadcast_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.broadcast_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.broadcast_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.templates &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.templates_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.templates_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.templates_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.contacts &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.contacts_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.contacts_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.contacts_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.bot &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.bot_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.bot_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.bot_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.backup &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.backup_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.backup_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.backup_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.erp_login &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.passwords_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.passwords_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.passwords_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.visit &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.visit_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.visit_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.visit_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.alps &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.alps_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.alps_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.alps_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.reminders &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.reminders_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.reminders_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.reminders_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.greetings &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.greetings_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.greetings_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.greetings_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }
                                            {feature === Feature.reports &&
                                                <>
                                                    <STableCell                 >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="left"
                                                            alignItems="left"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="button">{user.username}
                                                            </Typography>
                                                        </Stack>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.reports_access_fields.is_editable)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: true,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: false,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.reports_access_fields.is_hidden)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: true,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: false,
                                                                                    is_deletion_allowed: data.access.is_deletion_allowed
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                    <STableCell>
                                                        <Checkbox size="small" defaultChecked={Boolean(user.reports_access_fields.is_deletion_allowed)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: true
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                                else {
                                                                    let tmp = selectedData?.map((data) => {
                                                                        if (data.user === user._id)
                                                                            return {
                                                                                user: data.user,
                                                                                access: {
                                                                                    is_editable: data.access.is_editable,
                                                                                    is_hidden: data.access.is_hidden,
                                                                                    is_deletion_allowed: false
                                                                                }
                                                                            }
                                                                        return data
                                                                    })
                                                                    setSelectedData(tmp)
                                                                }
                                                            }}
                                                        />
                                                    </STableCell>
                                                </>
                                            }


                                        </STableRow>
                                    )
                                })}
                            </STableBody>
                        </STable>
                    </Box >
                    <Stack gap={2}>
                        <Button fullWidth variant="contained" color="primary"
                            onClick={() => {
                                if (selectedData && feature) {
                                    mutate({ feature: feature, body: selectedData })
                                    setSelectedData(undefined)
                                }

                            }}

                        >
                            {isLoading ? <CircularProgress /> :
                                "Save"}
                        </Button>
                        <Button fullWidth size={"small"} variant="outlined" color="primary"
                            onClick={() => {
                                setFeature(undefined)
                                setSelectedData(undefined)
                            }}

                        >
                            {isLoading ? <CircularProgress /> :
                                "Cancel"}
                        </Button>
                    </Stack>
                </DialogContent>

            </Dialog >


        </>
    )
}

export default ManageFeatureControlDialog
