import { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { AccessTypes, UpdateUserAccess } from '../../../services/UserServices';
import { Button, Checkbox, CircularProgress, Stack, Box, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material'
import { queryClient } from '../../../main';
import { BackendError } from '../../..';
import AlertBar from '../../snacks/AlertBar';
import { color1, color2, headColor } from '../../../utils/colors';
import { IUser } from '../../../types/user.types';


function AccessControlForm({ user }: { user: IUser }) {
    const { setChoice } = useContext(ChoiceContext)
    const [AccessFields, setAccessFields] = useState<AccessTypes>({
        user_access_fields: user.user_access_fields,
        crm_access_fields: user.crm_access_fields,
        contacts_access_fields: user.contacts_access_fields,
        templates_access_fields: user.templates_access_fields,
        bot_access_fields: user.bot_access_fields,
        broadcast_access_fields: user.broadcast_access_fields,
        backup_access_fields: user.backup_access_fields,
        reminders_access_fields: user.reminders_access_fields,
        alps_access_fields: user.alps_access_fields,
        tasks_access_fields: user.tasks_access_fields,
        checklists_access_fields: user.checklists_access_fields
    })
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<any>, BackendError, {
            id: string, access_fields: AccessTypes
        }>
        (UpdateUserAccess, {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
            }
        })



    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: UserChoiceActions.close_user })
            }, 1000)
    }, [setChoice, isSuccess])

    console.log(AccessFields)
    return (
        <>

            <Box sx={{
                overflow: "scroll",
                height: '73.5vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ width: "100%" }}
                    size="small">


                    <TableHead
                    >
                        <TableRow>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Feature
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Editor
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Hidden
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Delete
                                </Stack>
                            </TableCell>

                            {/* visitin card */}
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {/* user access fields */}
                        <TableRow
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: color1 },
                                '&:nth-of-type(even)': { bgcolor: color2 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                            }}>

                            <TableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">Users
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.user_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            user_access_fields: {
                                                is_editable: Boolean(!AccessFields.user_access_fields.is_editable),
                                                is_hidden: Boolean(AccessFields.user_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.user_access_fields.is_deletion_allowed),
                                            }
                                        })}
                                    disabled={user.created_by._id === user._id}

                                />
                            </TableCell>

                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.user_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            user_access_fields: {
                                                is_editable: Boolean(AccessFields.user_access_fields.is_editable),
                                                is_hidden: Boolean(!AccessFields.user_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.user_access_fields.is_deletion_allowed),
                                            }
                                        })}
                                    disabled={user.created_by._id === user._id}

                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.user_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            user_access_fields: {
                                                is_editable: Boolean(AccessFields.user_access_fields.is_editable),
                                                is_hidden: Boolean(AccessFields.user_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.user_access_fields.is_deletion_allowed),
                                            }
                                        })}
                                    disabled={user.created_by._id === user._id}
                                />
                            </TableCell>
                        </TableRow>
                        {/* crm access fields */}
                        <TableRow
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: color1 },
                                '&:nth-of-type(even)': { bgcolor: color2 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                            }}>

                            <TableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">crm
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.crm_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            crm_access_fields: {
                                                is_editable: Boolean(!AccessFields.crm_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.crm_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.crm_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>

                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.crm_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            crm_access_fields: {
                                                is_editable: Boolean(AccessFields.crm_access_fields.is_editable),

                                                is_hidden: Boolean(!AccessFields.crm_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.crm_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.crm_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            crm_access_fields: {
                                                is_editable: Boolean(AccessFields.crm_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.crm_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.crm_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>





                        </TableRow>
                        {/* bot access fields */}
                        <TableRow
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: color1 },
                                '&:nth-of-type(even)': { bgcolor: color2 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                            }}>

                            {/* bot access row */}
                            <TableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">Wa bot
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.bot_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            bot_access_fields: {
                                                is_editable: Boolean(!AccessFields.bot_access_fields.is_editable),
                                                is_hidden: Boolean(AccessFields.bot_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.bot_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>

                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.bot_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            bot_access_fields: {
                                                is_editable: Boolean(AccessFields.bot_access_fields.is_editable),

                                                is_hidden: Boolean(!AccessFields.bot_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.bot_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.bot_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            bot_access_fields: {
                                                is_editable: Boolean(AccessFields.bot_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.bot_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.bot_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>





                        </TableRow>

                        {/* checklist access fields */}
                        <TableRow
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: color1 },
                                '&:nth-of-type(even)': { bgcolor: color2 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                            }}>

                            <TableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">checklists
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.checklists_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            checklists_access_fields: {
                                                is_editable: Boolean(!AccessFields.checklists_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.checklists_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.checklists_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>

                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.checklists_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            checklists_access_fields: {
                                                is_editable: Boolean(AccessFields.checklists_access_fields.is_editable),

                                                is_hidden: Boolean(!AccessFields.checklists_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.checklists_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.checklists_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            checklists_access_fields: {
                                                is_editable: Boolean(AccessFields.checklists_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.checklists_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.checklists_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>





                        </TableRow>
                        {/* task access fields */}
                        <TableRow
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: color1 },
                                '&:nth-of-type(even)': { bgcolor: color2 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                            }}>

                            <TableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">tasks
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.tasks_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            tasks_access_fields: {
                                                is_editable: Boolean(!AccessFields.tasks_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.tasks_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.tasks_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>

                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.tasks_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            tasks_access_fields: {
                                                is_editable: Boolean(AccessFields.tasks_access_fields.is_editable),

                                                is_hidden: Boolean(!AccessFields.tasks_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.tasks_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.tasks_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            tasks_access_fields: {
                                                is_editable: Boolean(AccessFields.tasks_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.tasks_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.tasks_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>





                        </TableRow>
                        {/* templates access fields */}
                        <TableRow
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: color1 },
                                '&:nth-of-type(even)': { bgcolor: color2 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                            }}>

                            <TableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">templates
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.templates_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            templates_access_fields: {
                                                is_editable: Boolean(!AccessFields.templates_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.templates_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.templates_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>

                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.templates_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            templates_access_fields: {
                                                is_editable: Boolean(AccessFields.templates_access_fields.is_editable),

                                                is_hidden: Boolean(!AccessFields.templates_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.templates_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.templates_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            templates_access_fields: {
                                                is_editable: Boolean(AccessFields.templates_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.templates_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.templates_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>


                        </TableRow>
                        {/* broadcast access fields */}
                        <TableRow
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: color1 },
                                '&:nth-of-type(even)': { bgcolor: color2 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                            }}>

                            <TableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">broadcasts
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.broadcast_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            broadcast_access_fields: {
                                                is_editable: Boolean(!AccessFields.broadcast_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.broadcast_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.broadcast_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>

                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.broadcast_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            broadcast_access_fields: {
                                                is_editable: Boolean(AccessFields.broadcast_access_fields.is_editable),

                                                is_hidden: Boolean(!AccessFields.broadcast_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.broadcast_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.broadcast_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            broadcast_access_fields: {
                                                is_editable: Boolean(AccessFields.broadcast_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.broadcast_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.broadcast_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>





                        </TableRow>
                        {/* contacts access fields */}
                        <TableRow
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: color1 },
                                '&:nth-of-type(even)': { bgcolor: color2 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                            }}>

                            <TableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">contacts
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.contacts_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            contacts_access_fields: {
                                                is_editable: Boolean(!AccessFields.contacts_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.contacts_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.contacts_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>

                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.contacts_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            contacts_access_fields: {
                                                is_editable: Boolean(AccessFields.contacts_access_fields.is_editable),

                                                is_hidden: Boolean(!AccessFields.contacts_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.contacts_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.contacts_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            contacts_access_fields: {
                                                is_editable: Boolean(AccessFields.contacts_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.contacts_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.contacts_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>





                        </TableRow>
                        {/* reminder access fields */}
                        <TableRow
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: color1 },
                                '&:nth-of-type(even)': { bgcolor: color2 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                            }}>

                            <TableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">reminders
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.reminders_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            reminders_access_fields: {
                                                is_editable: Boolean(!AccessFields.reminders_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.reminders_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.reminders_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>

                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.reminders_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            reminders_access_fields: {
                                                is_editable: Boolean(AccessFields.reminders_access_fields.is_editable),

                                                is_hidden: Boolean(!AccessFields.reminders_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.reminders_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.reminders_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            reminders_access_fields: {
                                                is_editable: Boolean(AccessFields.reminders_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.reminders_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.reminders_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>





                        </TableRow>
                        {/* backup access fields */}
                        <TableRow
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: color1 },
                                '&:nth-of-type(even)': { bgcolor: color2 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                            }}>

                            <TableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">backup
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.backup_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            backup_access_fields: {
                                                is_editable: Boolean(!AccessFields.backup_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.backup_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.backup_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>

                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.backup_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            backup_access_fields: {
                                                is_editable: Boolean(AccessFields.backup_access_fields.is_editable),

                                                is_hidden: Boolean(!AccessFields.backup_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.backup_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.backup_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            backup_access_fields: {
                                                is_editable: Boolean(AccessFields.backup_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.backup_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.backup_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                        </TableRow>
                        {/* alps access fields */}
                        <TableRow
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: color1 },
                                '&:nth-of-type(even)': { bgcolor: color2 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                            }}>

                            <TableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">alps
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.alps_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            alps_access_fields: {
                                                is_editable: Boolean(!AccessFields.alps_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.alps_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.alps_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>

                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.alps_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            alps_access_fields: {
                                                is_editable: Boolean(AccessFields.alps_access_fields.is_editable),

                                                is_hidden: Boolean(!AccessFields.alps_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.alps_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.alps_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            alps_access_fields: {
                                                is_editable: Boolean(AccessFields.alps_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.alps_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.alps_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box >
            {/* user access fields */}


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
            <Stack gap={2}>
                <Button fullWidth variant="contained" color="primary"
                    onClick={() => {
                        mutate({ id: user._id, access_fields: AccessFields })
                    }}

                >
                    {isLoading ? <CircularProgress /> :
                        "Save"}
                </Button>
                <Button fullWidth size={"small"} variant="outlined" color="primary"
                    onClick={() => {
                        setChoice({ type: UserChoiceActions.close_user })
                    }}

                >
                    {isLoading ? <CircularProgress /> :
                        "Cancel"}
                </Button>
            </Stack>
        </>
    )
}

export default AccessControlForm