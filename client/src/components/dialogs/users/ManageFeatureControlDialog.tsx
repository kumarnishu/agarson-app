import { Box, Button, Checkbox, CircularProgress, Dialog, IconButton, Stack, Typography } from "@mui/material"
import { Cancel } from "@mui/icons-material"
import { useContext, useEffect, useState } from "react"
import { IUser } from "../../../types/user.types"
import { Feature, FeatureAccess } from "../../../types/access.types"
import { useMutation, useQuery } from "react-query"
import { AxiosResponse } from "axios"
import { BackendError } from "../../.."
import { GetUsers, UpdateFeatureAccess } from "../../../services/UserServices"
import AlertBar from "../../snacks/AlertBar"
import { STable, STableBody, STableCell, STableHead, STableRow } from "../../styled/STyledTable"
import { queryClient } from "../../../main"
import { UserContext } from "../../../contexts/userContext"

type TSelectedData = {
    user: string,
    access: FeatureAccess
}

function ManageFeatureControlDialog({ feature, setFeature }: { feature: string | undefined, setFeature: React.Dispatch<React.SetStateAction<string | undefined>> }) {
    let [selectedData, setSelectedData] = useState<TSelectedData[]>()
    const { data: usersData, isSuccess: isUserSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { user: LoggedInUser } = useContext(UserContext)
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
            if (feature === Feature.users) {
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
            if (feature === Feature.crm) {
                setSelectedData(usersData && usersData.data.map((user) => {
                    return {
                        user: user._id, access: {
                            is_editable: user.crm_access_fields.is_editable,
                            is_hidden: user.crm_access_fields.is_hidden,
                            is_deletion_allowed: user.crm_access_fields.is_deletion_allowed
                        }
                    }
                }))
            }
            if (feature === Feature.todos) {
                setSelectedData(usersData && usersData.data.map((user) => {
                    return {
                        user: user._id, access: {
                            is_editable: user.todos_access_fields.is_editable,
                            is_hidden: user.todos_access_fields.is_hidden,
                            is_deletion_allowed: user.todos_access_fields.is_deletion_allowed
                        }
                    }
                }))
            }

            if (feature === Feature.productions) {
                setSelectedData(usersData && usersData.data.map((user) => {
                    return {
                        user: user._id, access: {
                            is_editable: user.productions_access_fields.is_editable,
                            is_hidden: user.productions_access_fields.is_hidden,
                            is_deletion_allowed: user.productions_access_fields.is_deletion_allowed
                        }
                    }
                }))
            }
            if (feature === Feature.checklists) {
                setSelectedData(usersData && usersData.data.map((user) => {
                    return {
                        user: user._id, access: {
                            is_editable: user.checklists_access_fields.is_editable,
                            is_hidden: user.checklists_access_fields.is_hidden,
                            is_deletion_allowed: user.checklists_access_fields.is_deletion_allowed
                        }
                    }
                }))
            }
           
        
            if (feature === Feature.visit) {
                setSelectedData(usersData && usersData.data.map((user) => {
                    return {
                        user: user._id, access: {
                            is_editable: user.visit_access_fields.is_editable,
                            is_hidden: user.visit_access_fields.is_hidden,
                            is_deletion_allowed: user.visit_access_fields.is_deletion_allowed
                        }
                    }
                }))
            }


            if (feature === Feature.templates) {
                setSelectedData(usersData && usersData.data.map((user) => {
                    return {
                        user: user._id, access: {
                            is_editable: user.templates_access_fields.is_editable,
                            is_hidden: user.templates_access_fields.is_hidden,
                            is_deletion_allowed: user.templates_access_fields.is_deletion_allowed
                        }
                    }
                }))
            }

         

            if (feature === Feature.erp_reports) {
                setSelectedData(usersData && usersData.data.map((user) => {
                    return {
                        user: user._id, access: {
                            is_editable: user.erp_access_fields.is_editable,
                            is_hidden: user.erp_access_fields.is_hidden,
                            is_deletion_allowed: user.erp_access_fields.is_deletion_allowed
                        }
                    }
                }))
            }
            if (feature === Feature.backup) {
                setSelectedData(usersData && usersData.data.map((user) => {
                    return {
                        user: user._id, access: {
                            is_editable: user.backup_access_fields.is_editable,
                            is_hidden: user.backup_access_fields.is_hidden,
                            is_deletion_allowed: user.backup_access_fields.is_deletion_allowed
                        }
                    }
                }))
            }
        }
    }, [isUserSuccess])

    useEffect(() => {
        if (isSuccess) {
            setFeature(undefined)
            setSelectedData(undefined)
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

                <Stack direction="row"
                    spacing={2}
                    alignItems={'center'}
                >
                    <Typography variant="h6" p={1} sx={{ textTransform: 'uppercase', fontsize: 18, fontWeight: 'bold' }}>
                        Feature : {feature}
                    </Typography>
                </Stack>
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
                                                <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.user_access_fields.is_editable)}
                                                    onChange={() => {
                                                        let tmp = selectedData?.map((data) => {
                                                            if (data.user === user._id)
                                                                return {
                                                                    user: data.user,
                                                                    access: {
                                                                        is_editable: !user.user_access_fields.is_editable,
                                                                        is_hidden: data.access.is_hidden,
                                                                        is_deletion_allowed: data.access.is_deletion_allowed
                                                                    }
                                                                }
                                                            return data
                                                        })
                                                        setSelectedData(tmp)
                                                    }}
                                                />
                                            </STableCell>
                                            <STableCell>
                                                <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.user_access_fields.is_hidden)}
                                                    onChange={() => {
                                                        let tmp = selectedData?.map((data) => {
                                                            if (data.user === user._id)
                                                                return {
                                                                    user: data.user,
                                                                    access: {
                                                                        is_hidden: !user.user_access_fields.is_hidden,
                                                                        is_editable: data.access.is_editable,
                                                                        is_deletion_allowed: data.access.is_deletion_allowed
                                                                    }
                                                                }
                                                            return data
                                                        })
                                                        setSelectedData(tmp)
                                                    }}
                                                />
                                            </STableCell>
                                            <STableCell>
                                                <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.user_access_fields.is_deletion_allowed)}
                                                    onChange={() => {
                                                        let tmp = selectedData?.map((data) => {
                                                            if (data.user === user._id)
                                                                return {
                                                                    user: data.user,
                                                                    access: {
                                                                        is_deletion_allowed: !user.user_access_fields.is_deletion_allowed,
                                                                        is_editable: data.access.is_editable,
                                                                        is_hidden: data.access.is_hidden
                                                                    }
                                                                }
                                                            return data
                                                        })
                                                        setSelectedData(tmp)
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
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.crm_access_fields.is_editable)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_editable: !user.crm_access_fields.is_editable,
                                                                            is_hidden: data.access.is_hidden,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.crm_access_fields.is_hidden)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_hidden: !user.crm_access_fields.is_hidden,
                                                                            is_editable: data.access.is_editable,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.crm_access_fields.is_deletion_allowed)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_deletion_allowed: !user.crm_access_fields.is_deletion_allowed,
                                                                            is_editable: data.access.is_editable,
                                                                            is_hidden: data.access.is_hidden
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
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
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.todos_access_fields.is_editable)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_editable: !user.todos_access_fields.is_editable,
                                                                            is_hidden: data.access.is_hidden,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.todos_access_fields.is_hidden)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_hidden: !user.todos_access_fields.is_hidden,
                                                                            is_editable: data.access.is_editable,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.todos_access_fields.is_deletion_allowed)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_deletion_allowed: !user.todos_access_fields.is_deletion_allowed,
                                                                            is_editable: data.access.is_editable,
                                                                            is_hidden: data.access.is_hidden
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
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
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.productions_access_fields.is_editable)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_editable: !user.productions_access_fields.is_editable,
                                                                            is_hidden: data.access.is_hidden,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.productions_access_fields.is_hidden)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_hidden: !user.productions_access_fields.is_hidden,
                                                                            is_editable: data.access.is_editable,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.productions_access_fields.is_deletion_allowed)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_deletion_allowed: !user.productions_access_fields.is_deletion_allowed,
                                                                            is_editable: data.access.is_editable,
                                                                            is_hidden: data.access.is_hidden
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
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
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.checklists_access_fields.is_editable)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_editable: !user.checklists_access_fields.is_editable,
                                                                            is_hidden: data.access.is_hidden,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.checklists_access_fields.is_hidden)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_hidden: !user.checklists_access_fields.is_hidden,
                                                                            is_editable: data.access.is_editable,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.checklists_access_fields.is_deletion_allowed)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_deletion_allowed: !user.checklists_access_fields.is_deletion_allowed,
                                                                            is_editable: data.access.is_editable,
                                                                            is_hidden: data.access.is_hidden
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
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
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.templates_access_fields.is_editable)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_editable: !user.templates_access_fields.is_editable,
                                                                            is_hidden: data.access.is_hidden,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.templates_access_fields.is_hidden)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_hidden: !user.templates_access_fields.is_hidden,
                                                                            is_editable: data.access.is_editable,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.templates_access_fields.is_deletion_allowed)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_deletion_allowed: !user.templates_access_fields.is_deletion_allowed,
                                                                            is_editable: data.access.is_editable,
                                                                            is_hidden: data.access.is_hidden
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
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
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.backup_access_fields.is_editable)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_editable: !user.backup_access_fields.is_editable,
                                                                            is_hidden: data.access.is_hidden,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.backup_access_fields.is_hidden)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_hidden: !user.backup_access_fields.is_hidden,
                                                                            is_editable: data.access.is_editable,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.backup_access_fields.is_deletion_allowed)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_deletion_allowed: !user.backup_access_fields.is_deletion_allowed,
                                                                            is_editable: data.access.is_editable,
                                                                            is_hidden: data.access.is_hidden
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                            </>
                                        }
                                        {feature === Feature.erp_reports &&
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
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.erp_access_fields.is_editable)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_editable: !user.erp_access_fields.is_editable,
                                                                            is_hidden: data.access.is_hidden,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.erp_access_fields.is_hidden)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_hidden: !user.erp_access_fields.is_hidden,
                                                                            is_editable: data.access.is_editable,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.erp_access_fields.is_deletion_allowed)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_deletion_allowed: !user.erp_access_fields.is_deletion_allowed,
                                                                            is_editable: data.access.is_editable,
                                                                            is_hidden: data.access.is_hidden
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
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
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.visit_access_fields.is_editable)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_editable: !user.visit_access_fields.is_editable,
                                                                            is_hidden: data.access.is_hidden,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.visit_access_fields.is_hidden)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_hidden: !user.visit_access_fields.is_hidden,
                                                                            is_editable: data.access.is_editable,
                                                                            is_deletion_allowed: data.access.is_deletion_allowed
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
                                                        }}
                                                    />
                                                </STableCell>
                                                <STableCell>
                                                    <Checkbox size="small" disabled={!LoggedInUser?.user_access_fields.is_editable} defaultChecked={Boolean(user.visit_access_fields.is_deletion_allowed)}
                                                        onChange={() => {
                                                            let tmp = selectedData?.map((data) => {
                                                                if (data.user === user._id)
                                                                    return {
                                                                        user: data.user,
                                                                        access: {
                                                                            is_deletion_allowed: !user.visit_access_fields.is_deletion_allowed,
                                                                            is_editable: data.access.is_editable,
                                                                            is_hidden: data.access.is_hidden
                                                                        }
                                                                    }
                                                                return data
                                                            })
                                                            setSelectedData(tmp)
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
                </Box>
                <Stack gap={2} pt={1}>
                    <Button fullWidth variant="contained" color="primary"
                        onClick={() => {
                            if (selectedData && feature) {
                                mutate({ feature: feature, body: selectedData })
                            }

                        }}
                        disabled={!LoggedInUser?.user_access_fields.is_editable}
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
            </Dialog >


        </>
    )
}

export default ManageFeatureControlDialog