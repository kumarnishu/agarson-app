import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import {  GetPermissions } from '../../../services/UserServices';

type IPermission = {
    value: string,
    label: string
}

type IMenu = {
    label: string,
    menues?: IMenu[],
    permissions: IPermission[]
}


export default function PermissionsDialog() {
    const { data } = useQuery<AxiosResponse<IMenu>, BackendError>("permissions", GetPermissions)
    
    console.log(data?.data)
    return (
       <></>
    );
}
