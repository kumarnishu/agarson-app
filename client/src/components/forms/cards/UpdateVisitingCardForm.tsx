import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { UpdateVisitingCard } from '../../../services/LeadsServices';
import { States } from '../../../utils/states';
import { BackendError, Target } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IVisitingCard } from '../../../types/visiting_card.types';
import { IUser } from '../../../types/user.types';

export type TformData = {
    name: string,
    city: string,
    state: string,
    salesman?: IUser,
    comment: string,
    card: string | Blob | File
}

function UpdateVisitingCardForm({ card, users }: { card: IVisitingCard, users: IUser[] }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IVisitingCard>, BackendError, {
            id: string; body: FormData;
        }>
        (UpdateVisitingCard, {
            onSuccess: () => {
                queryClient.invalidateQueries('cards')
            }
        })
    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            name: card.name,
            city: card.city,
            state: card.state,
            comment: "",
            card: ""
        },
        validationSchema: Yup.object({
            name: Yup.string().required(),

            city: Yup.string().required()
            ,
            state: Yup.string().required()
            ,

            comment: Yup.string().required()
            ,
            card: Yup.mixed<File>()
                .test("size", "size is allowed only less than 10mb",
                    file => {
                        if (file)
                            if (!file.size) //file not provided
                                return true
                            else
                                return Boolean(file.size <= 10 * 1024 * 1024)
                        return true
                    }
                )
                .test("type", " allowed only .jpg, .jpeg, .png, .gif .pdf .csv .xlsx .docs",
                    file => {
                        const Allowed = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf"]
                        if (file)
                            if (!file.size) //file not provided
                                return true
                            else
                                return Boolean(Allowed.includes(file.type))
                        return true
                    }
                )
        }),
        onSubmit: (values: TformData) => {
            let leadData = {
                name: values.name,
                city: values.city,
                state: values.state,
                comment: values.comment,
                salesman: values.salesman

            }
            let formdata = new FormData()
            formdata.append("body", JSON.stringify(leadData))
            if (values.card)
                formdata.append("card", values.card)
            mutate({ id: card._id, body: formdata })
        }
    });
    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: LeadChoiceActions.close_lead })
        }
    }, [isSuccess, setChoice])
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                {/* name */}

                <TextField
                    autoFocus

                    fullWidth


                    error={
                        formik.touched.name && formik.errors.name ? true : false
                    }
                    id="name"
                    label="Name"
                    helperText={
                        formik.touched.name && formik.errors.name ? formik.errors.name : ""
                    }
                    {...formik.getFieldProps('name')}
                />



                {/* city */}


                < TextField
                    focused
                    error={
                        formik.touched.city && formik.errors.city ? true : false
                    }
                    id="city"
                    label="City"
                    fullWidth
                    helperText={
                        formik.touched.city && formik.errors.city ? formik.errors.city : ""
                    }
                    {...formik.getFieldProps('city')}
                />

                {/* state */}


                < TextField

                    select


                    SelectProps={{
                        native: true
                    }}
                    focused

                    error={
                        formik.touched.state && formik.errors.state ? true : false
                    }
                    id="state"
                    label="State"
                    fullWidth
                    helperText={
                        formik.touched.state && formik.errors.state ? formik.errors.state : ""
                    }
                    {...formik.getFieldProps('state')}
                >
                    <option value="">

                    </option>
                    {
                        States.map(state => {
                            return (<option key={state.code} value={state.state.toLowerCase()}>
                                {state.state}
                            </option>)
                        })
                    }
                </TextField>


                {/* lead owners */}


                < TextField
                    select
                    SelectProps={{
                        native: true,
                    }}
                    focused

                    error={
                        formik.touched.salesman && formik.errors.salesman ? true : false
                    }
                    id="salesman"
                    label="Sales Owners"
                    fullWidth
                    required
                    helperText={
                        formik.touched.salesman && formik.errors.salesman ? formik.errors.salesman : ""
                    }
                    {...formik.getFieldProps('salesman')}
                >

                    {
                        users.map((user, index) => {
                            if (!user.crm_access_fields.is_hidden) {
                                return (<option key={index} value={user._id}>
                                    {user.username}
                                </option>)
                            }
                            else return null
                        })
                    }
                </TextField>

                {/* remark */}


                < TextField
                    multiline
                    minRows={2}
                    error={
                        formik.touched.comment && formik.errors.comment ? true : false
                    }
                    id="comment"
                    label="Comment"
                    fullWidth
                    helperText={
                        formik.touched.comment && formik.errors.comment ? formik.errors.comment : ""
                    }
                    {...formik.getFieldProps('comment')}
                />



                <TextField
                    fullWidth
                    error={
                        formik.touched.card && formik.errors.card ? true : false
                    }
                    helperText={
                        formik.touched.card && formik.errors.card ? (formik.errors.card) : ""
                    }
                    label="Visting Card"
                    focused

                    type="file"
                    name="card"
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                        e.preventDefault()
                        const target: Target = e.currentTarget
                        let files = target.files
                        if (files) {
                            let file = files[0]
                            formik.setFieldValue("card", file)
                        }
                    }}
                />
                <Button variant="contained" color="primary" type="submit"
                    disabled={isLoading}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update Vsiting Card"}
                </Button>
                <Stack sx={{ maxWidth: '350px' }}>
                    {/* @ts-ignore */}
                    {formik.values.card ? <img src={formik.values.card && URL.createObjectURL(formik.values.card)} alt="image" /> : <>
                        {card && card.card && <img src={card.card.public_url} alt="image" />}
                    </>}
                </Stack>
            </Stack>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="card updated" color="success" />
                ) : null
            }

        </form>
    )
}

export default UpdateVisitingCardForm
