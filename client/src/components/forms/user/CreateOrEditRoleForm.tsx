import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { ChoiceContext, UserChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IMenu, IPermission, IRole } from '../../../types/user.types';
import { CreateOreditRole, GetPermissions } from '../../../services/UserServices';

function CreateOrEditRoleForm({ role }: { role?: IRole }) {
    const [role_name, setRoleName] = useState<string | undefined>(role && role.role)
    const [permissiontree, setPermissiontree] = useState<IMenu>()
    const [permissions, setPermissions] = useState<string[]>(role ? role.permissions : [])
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, { role?: IRole, body: { role: string, permissions: string[] } }>
        (CreateOreditRole, {
            onSuccess: () => {
                queryClient.invalidateQueries('roles')
            }
        })
    const { data, isSuccess: isPermSuccess } = useQuery<AxiosResponse<IMenu>, BackendError>("permissions", GetPermissions)

    const { setChoice } = useContext(ChoiceContext)

    function handleRole() {
        console.log(role)
        if (!role_name) {
            alert("please provide role name")
            return;
        }
        else {
            if (role)
                mutate({ role: role, body: { role: role_name, permissions: permissions } })
            else
                mutate({ body: { role: role_name, permissions: permissions } })

        }

    }

    useEffect(() => {
        if (isPermSuccess) {
            setPermissiontree(data.data);
        }

    }, [isPermSuccess, setChoice])

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: UserChoiceActions.close_user })

        }
    }, [isSuccess, setChoice])

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
                                        defaultChecked={role?.permissions.includes(perm.value)}
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

    return (
        <form style={{ paddingTop: '10px' }} onSubmit={(e) => e.preventDefault()}>
            <TextField
                required
                autoFocus
                value={role_name}
                onChange={(e) => setRoleName(e.target.value)}
                id="role"
                label="Role"
                fullWidth
            />
          <div>
              {permissiontree && renderData(permissiontree)}
          </div>
            <Stack
                gap={2}
                pt={2}
            >
                {/* remarks */}

                <Button variant="contained" color="primary"
                    onClick={handleRole}
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : !role ? "Add Role" : "Update Role"}
                </Button>
            </Stack>

            {
                isError ? (
                    <>
                        {<AlertBar message={error?.response.data.message} color="error" />}
                    </>
                ) : null
            }
            {
                isSuccess ? (
                    <>
                        {!role ? <AlertBar message="new role created" color="success" /> : <AlertBar message="role updated" color="success" />}
                    </>
                ) : null
            }

        </form>
    )
}

export default CreateOrEditRoleForm
