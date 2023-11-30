import { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { AccessTypes, UpdateUserAccess } from '../../../services/UserServices';
import { Button, Checkbox, CircularProgress, Stack, Box,  Typography } from '@mui/material'
import { queryClient } from '../../../main';
import { BackendError } from '../../..';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { STable, STableBody, STableCell, STableHead, STableRow } from '../../styled/STyledTable';


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
        checklists_access_fields: user.checklists_access_fields,
        reports_access_fields: user.reports_access_fields,
        visit_access_fields: user.visit_access_fields,
        todos_access_fields: user.todos_access_fields
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

    return (
        <>

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
                                    Feature
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
                        {/* user access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">Users
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
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
                            </STableCell>

                            <STableCell>
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
                            </STableCell>
                            <STableCell>
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
                            </STableCell>
                        </STableRow>
                        {/* crm access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">crm
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
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
                            </STableCell>

                            <STableCell>
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
                            </STableCell>
                            <STableCell>
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
                            </STableCell>





                        </STableRow>
                        {/* todo access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">Todos
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.todos_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            todos_access_fields: {
                                                is_editable: Boolean(!AccessFields.todos_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.todos_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.todos_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </STableCell>

                            <STableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.todos_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            todos_access_fields: {
                                                is_editable: Boolean(AccessFields.todos_access_fields.is_editable),

                                                is_hidden: Boolean(!AccessFields.todos_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.todos_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </STableCell>
                            <STableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.todos_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            todos_access_fields: {
                                                is_editable: Boolean(AccessFields.todos_access_fields.is_editable),

                                                is_hidden: Boolean(AccessFields.todos_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.todos_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </STableCell>





                        </STableRow>
                        {/* bot access fields */}
                        <STableRow
                            >

                            {/* bot access row */}
                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">Wa bot
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
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
                            </STableCell>

                            <STableCell>
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
                            </STableCell>
                            <STableCell>
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
                            </STableCell>





                        </STableRow>

                        {/* checklist access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">checklists
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
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
                            </STableCell>

                            <STableCell>
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
                            </STableCell>
                            <STableCell>
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
                            </STableCell>





                        </STableRow>
                        {/* task access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">tasks
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
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
                            </STableCell>

                            <STableCell>
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
                            </STableCell>
                            <STableCell>
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
                            </STableCell>





                        </STableRow>
                        {/* visit access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">My Visit
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.visit_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            visit_access_fields: {
                                                is_editable: Boolean(!AccessFields.visit_access_fields.is_editable),
                                                is_hidden: Boolean(AccessFields.visit_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.visit_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </STableCell>

                            <STableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.visit_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            visit_access_fields: {
                                                is_editable: Boolean(AccessFields.visit_access_fields.is_editable),
                                                is_hidden: Boolean(!AccessFields.visit_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.visit_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </STableCell>
                            <STableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.visit_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            visit_access_fields: {
                                                is_editable: Boolean(AccessFields.visit_access_fields.is_editable),
                                                is_hidden: Boolean(AccessFields.visit_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.visit_access_fields.is_deletion_allowed),
                                            }
                                        })}
                                />
                            </STableCell>
                        </STableRow>
                        {/* reports access  */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">Reports
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.reports_access_fields.is_editable)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            reports_access_fields: {
                                                is_editable: Boolean(!AccessFields.reports_access_fields.is_editable),
                                                is_hidden: Boolean(AccessFields.reports_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.reports_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </STableCell>

                            <STableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.reports_access_fields.is_hidden)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            reports_access_fields: {
                                                is_editable: Boolean(AccessFields.reports_access_fields.is_editable),
                                                is_hidden: Boolean(!AccessFields.reports_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(AccessFields.reports_access_fields.is_deletion_allowed),
                                            }
                                        })}

                                />
                            </STableCell>
                            <STableCell>
                                <Checkbox size="small" checked={Boolean(AccessFields.reports_access_fields.is_deletion_allowed)}
                                    onChange={() => setAccessFields(
                                        {
                                            ...AccessFields,
                                            reports_access_fields: {
                                                is_editable: Boolean(AccessFields.reports_access_fields.is_editable),
                                                is_hidden: Boolean(AccessFields.reports_access_fields.is_hidden),
                                                is_deletion_allowed: Boolean(!AccessFields.reports_access_fields.is_deletion_allowed),
                                            }
                                        })}
                                />
                            </STableCell>
                        </STableRow>
                        {/* templates access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">templates
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
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
                            </STableCell>

                            <STableCell>
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
                            </STableCell>
                            <STableCell>
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
                            </STableCell>


                        </STableRow>
                        {/* broadcast access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">broadcasts
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
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
                            </STableCell>

                            <STableCell>
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
                            </STableCell>
                            <STableCell>
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
                            </STableCell>





                        </STableRow>
                        {/* contacts access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">contacts
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
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
                            </STableCell>

                            <STableCell>
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
                            </STableCell>
                            <STableCell>
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
                            </STableCell>





                        </STableRow>
                        {/* reminder access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">reminders
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
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
                            </STableCell>

                            <STableCell>
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
                            </STableCell>
                            <STableCell>
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
                            </STableCell>





                        </STableRow>
                        {/* backup access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">backup
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
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
                            </STableCell>

                            <STableCell>
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
                            </STableCell>
                            <STableCell>
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
                            </STableCell>
                        </STableRow>
                        {/* alps access fields */}
                        <STableRow
                            >

                            <STableCell                 >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <Typography variant="button">alps
                                    </Typography>
                                </Stack>
                            </STableCell>
                            <STableCell>
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
                            </STableCell>

                            <STableCell>
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
                            </STableCell>
                            <STableCell>
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
                            </STableCell>
                        </STableRow>
                    </STableBody>
                </STable>
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