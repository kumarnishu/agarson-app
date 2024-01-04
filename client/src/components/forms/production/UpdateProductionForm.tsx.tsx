import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IArticle, IMachine, IProduction } from '../../../types/production.types';
import { GetArticles, GetMachines, UpdateProduction } from '../../../services/ProductionServices';
import { IUser } from '../../../types/user.types';
import { GetUsers } from '../../../services/UserServices';
import { UserContext } from '../../../contexts/userContext';

function UpdateProductionForm({ production }: { production: IProduction }) {
    const { user } = useContext(UserContext)
    const { data: users } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { data: machines } = useQuery<AxiosResponse<IMachine[]>, BackendError>("machines", async () => GetMachines())
    const { data: articles } = useQuery<AxiosResponse<IArticle[]>, BackendError>("articles", async () => GetArticles())
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IProduction>, BackendError, {
            id: string,
            body: {
                machine: string,
                thekedar: string,
                article: string,
                manpower: number,
                production: number,
                big_repair: number,
                small_repair: number
            }
        }>
        (UpdateProduction, {
            onSuccess: () => {
                queryClient.invalidateQueries('productions')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik({
        initialValues: {
            machine: production.machine._id,
            thekedar: production.thekedar._id,
            article: production.article._id,
            manpower: production.manpower,
            production: production.production,
            big_repair: production.big_repair,
            small_repair: production.small_repair
        },
        validationSchema: Yup.object({
            machine: Yup.string()
                .required('Required field'),
            thekedar: Yup.string()
                .required('Required field'),
            article: Yup.string()
                .required('Required field'),
            manpower: Yup.number()
                .required('Required field'),
            production: Yup.number()
                .required('Required field'),
            big_repair: Yup.number()
                .required('Required field'),
            small_repair: Yup.number()
                .required('Required field'),
        }),
        onSubmit: (values) => {
            mutate({
                id: production._id,
                body: {
                    machine: values.machine,
                    thekedar: values.thekedar,
                    article: values.article,
                    manpower: values.manpower,
                    production: values.production,
                    big_repair: values.big_repair,
                    small_repair: values.small_repair,
                }

            })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: UserChoiceActions.close_user })
            }, 1000)
        }
    }, [isSuccess, setChoice])


    return (
        <form onSubmit={formik.handleSubmit}>

            <Stack
                direction="column"
                gap={2}
                pt={2}
            >

                < TextField
                    select

                    SelectProps={{
                        native: true,
                    }}
                    error={
                        formik.touched.machine && formik.errors.machine ? true : false
                    }
                    id="machine"
                    helperText={
                        formik.touched.machine && formik.errors.machine ? formik.errors.machine : ""
                    }
                    {...formik.getFieldProps('machine')}
                    required
                    label="Select Machine"
                    fullWidth
                >
                    <option key={'00'} value={undefined}>
                    </option>
                    {
                        machines && machines.data && machines.data.map((machine, index) => {
                            return (<option key={index} value={machine._id}>
                                {machine.name}
                            </option>)

                        })
                    }
                </TextField>
                {user?.assigned_users && user?.assigned_users.length > 0 && < TextField
                    select

                    SelectProps={{
                        native: true,
                    }}
                    error={
                        formik.touched.thekedar && formik.errors.thekedar ? true : false
                    }
                    id="thekedar"
                    helperText={
                        formik.touched.thekedar && formik.errors.thekedar ? formik.errors.thekedar : ""
                    }
                    {...formik.getFieldProps('thekedar')}
                    required
                    label="Select Thekedar"
                    fullWidth
                >
                    <option key={'00'} value={undefined}>

                    </option>
                    {
                        users && users.data.map((user, index) => {
                            if (!user.productions_access_fields.is_hidden)
                                return (<option key={index} value={user._id}>
                                    {user.username}
                                </option>)
                            else
                                return null
                        })
                    }
                </TextField>}
                {/* articles */}
                < TextField
                    select

                    SelectProps={{
                        native: true,
                    }}
                    error={
                        formik.touched.article && formik.errors.article ? true : false
                    }
                    id="article"
                    helperText={
                        formik.touched.article && formik.errors.article ? formik.errors.article : ""
                    }
                    {...formik.getFieldProps('article')}
                    required
                    label="Select Article"
                    fullWidth
                >
                    <option key={'00'} value={undefined}>
                    </option>
                    {
                        articles && articles.data && articles.data.map((article, index) => {
                            return (<option key={index} value={article._id}>
                                {article.name}
                            </option>)
                        })
                    }
                </TextField>
                <TextField
                    required
                    fullWidth
                    type="number"
                    error={
                        formik.touched.manpower && formik.errors.manpower ? true : false
                    }
                    id="manpower"
                    label="Man Power"
                    helperText={
                        formik.touched.manpower && formik.errors.manpower ? formik.errors.manpower : ""
                    }
                    {...formik.getFieldProps('manpower')}
                />
                <TextField
                    required
                    fullWidth
                    type="number"
                    error={
                        formik.touched.production && formik.errors.production ? true : false
                    }
                    id="production"
                    label="Production"
                    helperText={
                        formik.touched.production && formik.errors.production ? formik.errors.production : ""
                    }
                    {...formik.getFieldProps('production')}
                />
                <TextField
                    required
                    fullWidth
                    type="number"
                    error={
                        formik.touched.big_repair && formik.errors.big_repair ? true : false
                    }
                    id="big_repair"
                    label="Big Repair"
                    helperText={
                        formik.touched.big_repair && formik.errors.big_repair ? formik.errors.big_repair : ""
                    }
                    {...formik.getFieldProps('big_repair')}
                />
                <TextField
                    required
                    fullWidth
                    type="number"
                    error={
                        formik.touched.small_repair && formik.errors.small_repair ? true : false
                    }
                    id="small_repair"
                    label="Small Repair"
                    helperText={
                        formik.touched.small_repair && formik.errors.small_repair ? formik.errors.small_repair : ""
                    }
                    {...formik.getFieldProps('small_repair')}
                />

                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="updated" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update Production"}
                </Button>
            </Stack>
        </form>
    )
}

export default UpdateProductionForm
