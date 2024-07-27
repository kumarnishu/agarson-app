import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Stack, Button, CircularProgress, TextField } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { ChoiceContext, UserChoiceActions } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from 'react-query';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { useFormik } from 'formik';
import * as Yup from "yup"
import {  IMenu, IPermission, IUser } from '../../../types/user.types';
import { AssignPermissionsToUsers, GetPermissions, GetUsers } from '../../../services/UserServices';


function AssignPermissionsToUsersDialog() {
    const [users, setUsers] = useState<IUser[]>([])
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const [permissiontree, setPermissiontree] = useState<IMenu>()
    const [permissions, setPermissions] = useState<string[]>([])
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            body: {
                user_ids: string[],
                permissions: string[]
            }
        }>
        (AssignPermissionsToUsers, {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
            }
        })
    const { data:Permdata, isSuccess: isPermSuccess } = useQuery<AxiosResponse<IMenu>, BackendError>("permissions", GetPermissions)

    const formik = useFormik<{
        user_ids: string[],
        
    }>({
        initialValues: {
            user_ids: [],
          
        },
        validationSchema: Yup.object({
            user_ids: Yup.array()
                .required('field'),
           
        }),
        onSubmit: (values: {
            user_ids: string[],
        }) => {
            mutate({
                body: {
                    user_ids: values.user_ids,
                    permissions: permissions
                }
            })

        }
    });

    useEffect(() => {
        if (isPermSuccess) {
            setPermissiontree(Permdata.data);
        }

    }, [isPermSuccess, setChoice])

    const renderData = (permissiontree: IMenu) => {
        if (Array.isArray(permissiontree)) {
            return permissiontree.map((item, index) => (
                <div key={index} style={{ paddingTop: 10 }}>
                    <h3 style={{ paddingLeft: item.menues && item.permissions ? '10px' : '25px' }}>{item.label}</h3>
                    {item.permissions && (
                        <ul>
                            {item.permissions.map((perm: IPermission, idx: number) => (
                                <Stack flexDirection={'row'} pl={item.menues && item.permissions ? '10px' : '25px'} key={idx}>
                                    <input type="checkbox"
                                        defaultChecked={permissions.includes(perm.value)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                let perms = permissions;
                                                if (!perms.includes(perm.value)) {
                                                    perms.push(perm.value);
                                                    setPermissions(perms);
                                                }
                                            }
                                            else {
                                                let perms = permissions.filter((i) => { return i !== perm.value })
                                                setPermissions(perms);
                                            }
                                        }} /><span style={{ paddingLeft: 5 }}>{perm.label}</span>
                                </Stack>
                            ))}
                        </ul>
                    )}
                    {item.menues && renderData(item.menues)}
                </div>
            ));
        }
        return null;
    };
    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [isUsersSuccess, usersData])


    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: UserChoiceActions.close_user });
            formik.setValues({ user_ids: [] });
        }
    }, [isSuccess])
    return (
        <Dialog
            fullWidth
            open={choice === UserChoiceActions.bulk_assign_role ? true : false}
            onClose={() => {
                setChoice({ type: UserChoiceActions.close_user });
                formik.setValues({ user_ids: [] });
            }}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {
                setChoice({ type: UserChoiceActions.close_user });
                formik.setValues({ user_ids: [] });
            }}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Assign Permissions
            </DialogTitle>
            <DialogContent>
                <Stack
                    gap={2}
                >
                    <Typography variant="body1" color="error">

                        { `Warning ! This will update ${permissions.length} permissions to the ${formik.values.user_ids.length} Users.`}
                       
                    </Typography>
                    <Button onClick={() => formik.setValues({ user_ids: []})}>Remove Selection</Button>
                    <form onSubmit={formik.handleSubmit}>
                        < TextField
                            select
                            SelectProps={{
                                native: true,
                                multiple: true
                            }}
                            focused
                            id="Users"
                            label="Select Users"
                            fullWidth
                            {...formik.getFieldProps('user_ids')}
                        >
                            {
                                users.map(user => {
                                    if (user.is_active)
                                        return (<option key={user._id} value={user._id}>
                                            {user.username}
                                        </option>)
                                })
                            }
                        </TextField>


                        <Button style={{ padding: 10, marginTop: 10 }} variant="contained" color="primary" type="submit"
                            disabled={Boolean(isLoading)}
                            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                        </Button>
                    </form>
                    <div>
                        {permissiontree && renderData(permissiontree)}
                    </div>

                </Stack>
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="successfull" color="success" />
                    ) : null
                }
            </DialogContent>
        </Dialog >
    )
}

export default AssignPermissionsToUsersDialog