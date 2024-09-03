import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import {  GetPermissions } from '../../../services/UserServices';
import { IMenu } from '../../../dtos/users/user.dto';



export default function PermissionsDialog() {
    const { data } = useQuery<AxiosResponse<IMenu>, BackendError>("permissions", GetPermissions)
    
    console.log(data?.data)
    return (
       <></>
    );
}
