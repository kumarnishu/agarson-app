import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import {  ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { GetArticles, UpdateDye } from '../../../services/ProductionServices';
import { IArticle, IDye } from '../../../types/production.types';



function UpdateDyeForm({ dye }: { dye: IDye }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IDye>, BackendError, {
            body: { dye_number: number, size: string, article_id: string, st_weight: number }, id: string
        }>
        (UpdateDye, {
            onSuccess: () => {
                queryClient.invalidateQueries('dyes')
            }
        })
    const { data: articles } = useQuery<AxiosResponse<IArticle[]>, BackendError>("articles", async () => GetArticles())
    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik({
        initialValues: {
            dye_number: dye.dye_number,
            size: dye.size,
            st_weight: dye.stdshoe_weight,
            article_id: dye.article._id
        },
        validationSchema: Yup.object({
            dye_number: Yup.number()
                .required('Required field'),
            size: Yup.string()
                .required('Required field'),
            article_id: Yup.string()
                .required('Required field'),
            st_weight: Yup.string()
                .required('Required field'),


        }),
        onSubmit: (values) => {
            mutate({
                id: dye._id, body: {
                    dye_number: values.dye_number,
                    size: values.size,
                    article_id: values.article_id,
                    st_weight: values.st_weight } })
        }
    });



    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: ProductionChoiceActions.close_production })
        }
    }, [isSuccess, setChoice])

    return (
        <form onSubmit={formik.handleSubmit}>

            <Stack
                direction="column"
                gap={2}
                pt={2}
            >
                <TextField
                    type="number"
                    required
                    fullWidth
                    error={
                        formik.touched.dye_number && formik.errors.dye_number ? true : false
                    }
                    id="dye_number"
                    label="Dye Number"
                    helperText={
                        formik.touched.dye_number && formik.errors.dye_number ? formik.errors.dye_number : ""
                    }
                    {...formik.getFieldProps('dye_number')}
                />
                <TextField
                    required
                    fullWidth
                    error={
                        formik.touched.size && formik.errors.size ? true : false
                    }
                    id="size"
                    label="Size"
                    helperText={
                        formik.touched.size && formik.errors.size ? formik.errors.size : ""
                    }
                    {...formik.getFieldProps('size')}
                />
                <TextField
                    required
                    fullWidth
                    error={
                        formik.touched.st_weight && formik.errors.st_weight ? true : false
                    }
                    id="st_weight"
                    type='number'
                    label="St Weight"
                    helperText={
                        formik.touched.st_weight && formik.errors.st_weight ? formik.errors.st_weight : ""
                    }
                    {...formik.getFieldProps('st_weight')}
                />
                < TextField
                    select
                    focused
                    SelectProps={{ native: true }}
                    error={
                        formik.touched.article_id && formik.errors.article_id ? true : false
                    }
                    id="article_id"
                    helperText={
                        formik.touched.article_id && formik.errors.article_id ? formik.errors.article_id : ""
                    }
                    {...formik.getFieldProps('article_id')}
                    required
                    label="Select Article"
                    fullWidth
                >
                    {
                        articles && articles.data && articles.data.map((article, index) => {
                            return (<option key={index} value={article._id}>
                                {article.display_name}
                            </option>)
                        })
                    }
                </TextField>
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="dye updated" color="success" />
                    ) : null
                }
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update Dye"}
                </Button>
            </Stack>
        </form>
    )
}

export default UpdateDyeForm
