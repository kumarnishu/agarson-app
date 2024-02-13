import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext,  VisitChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { AddAnkitInput } from '../../../services/VisitServices';
import { IVisitReport } from '../../../types/visit.types';


type TformData = {
    input: string,
}

function AddAnkitInputForm({ visit }: { visit: IVisitReport }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, {
            id: string;
            body: {
                input: string;
            }
        }>
        (AddAnkitInput, {
            onSuccess: () => {
                queryClient.invalidateQueries('visits')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            input: "",
        },
        validationSchema: Yup.object({
            input: Yup.string().required("required"),
        }),
        onSubmit: (values: TformData) => {
            let Data = {
                input: values.input,
            }
            mutate({ id: visit._id, body: Data })
        }
    });


    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: VisitChoiceActions.close_visit })
        }
    }, [isSuccess, setChoice])

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack sx={{ direction: { xs: 'column', md: 'row' } }}>
                <Stack
                    direction="column"
                    gap={2}
                    sx={{ pt: 2 }}
                >

                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        multiline
                        minRows={5}
                        error={
                            formik.touched.input && formik.errors.input ? true : false
                        }
                        id="input"
                        label="Ankit Input"
                        helperText={
                            formik.touched.input && formik.errors.input ? formik.errors.input : ""
                        }
                        {...formik.getFieldProps('input')}
                    />

                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="Added input SuccessFull" color="success" />
                        ) : null
                    }
                    <Button variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                    </Button>
                </Stack>
            </Stack>

        </form >
    )
}

export default AddAnkitInputForm
