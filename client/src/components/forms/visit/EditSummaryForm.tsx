import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, VisitChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { EditVisitSummary } from '../../../services/VisitServices';
import { IVisitReport } from '../../../types/visit.types';


type TformData = {
    summary: string,
    is_old_party: boolean,
    dealer_of: string,
    mobile: string,
    refs_given: string,
    reviews_taken: number,
    turnover: string
}

function EditSummaryForm({ visit }: { visit: IVisitReport }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, {
            id: string;
            body: {
                summary: string;
                is_old_party: boolean;
                dealer_of: string;
                mobile: string;
                refs_given: string;
                reviews_taken: number;
                turnover: string
            }
        }>
        (EditVisitSummary, {
            onSuccess: () => {
                queryClient.invalidateQueries('visit')
                queryClient.invalidateQueries('visits')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            summary: visit.summary,
            is_old_party: Boolean(visit.is_old_party),
            mobile: visit.mobile,
            dealer_of: visit.dealer_of,
            refs_given: visit.refs_given,
            reviews_taken: visit.reviews_taken,
            turnover: visit.turnover,
        },
        validationSchema: Yup.object({
            summary: Yup.string().required("required"),
            mobile: Yup.string().required("required mobile string")
                .min(10, 'Must be 10 digits')
                .max(10, 'Must be 10 digits'),
            is_old_party: Yup.boolean().required("required"),
            dealer_of: Yup.string().required("required"),
            refs_given: Yup.string().required("required"),
            reviews_taken: Yup.number().required("required"),
            turnover: Yup.string().required("required")

        }),
        onSubmit: (values: TformData) => {
            let Data = {
                summary: values.summary,
                is_old_party: Boolean(values.is_old_party),
                dealer_of: values.dealer_of,
                mobile: values.mobile,
                refs_given: values.refs_given,
                reviews_taken: values.reviews_taken,
                turnover: values.turnover
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
                        error={
                            formik.touched.mobile && formik.errors.mobile ? true : false
                        }
                        id="mobile"
                        label="Party Mobile"
                        helperText={
                            formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : ""
                        }
                        {...formik.getFieldProps('mobile')}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        error={
                            formik.touched.dealer_of && formik.errors.dealer_of ? true : false
                        }
                        id="dealer_of"
                        label="Dealer of"
                        helperText={
                            formik.touched.dealer_of && formik.errors.dealer_of ? formik.errors.dealer_of : ""
                        }
                        {...formik.getFieldProps('dealer_of')}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        error={
                            formik.touched.turnover && formik.errors.turnover ? true : false
                        }
                        id="turnover"
                        label="Turn Over"
                        helperText={
                            formik.touched.turnover && formik.errors.turnover ? formik.errors.turnover : ""
                        }
                        {...formik.getFieldProps('turnover')}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        error={
                            formik.touched.refs_given && formik.errors.refs_given ? true : false
                        }
                        id="refs_given"
                        label="References"
                        helperText={
                            formik.touched.refs_given && formik.errors.refs_given ? formik.errors.refs_given : ""
                        }
                        {...formik.getFieldProps('refs_given')}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        error={
                            formik.touched.reviews_taken && formik.errors.reviews_taken ? true : false
                        }
                        id="reviews_taken"
                        label="Reviews taken"
                        helperText={
                            formik.touched.reviews_taken && formik.errors.reviews_taken ? formik.errors.reviews_taken : ""
                        }
                        {...formik.getFieldProps('reviews_taken')}
                    />
                    <FormGroup>
                        <FormControlLabel control={<Checkbox
                            defaultChecked={Boolean(formik.values.is_old_party)}
                            {...formik.getFieldProps('is_old_party')}
                        />} label="Is Old Party ?" />
                    </FormGroup>
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        multiline
                        minRows={5}
                        error={
                            formik.touched.summary && formik.errors.summary ? true : false
                        }
                        id="summary"
                        label="Summary"
                        helperText={
                            formik.touched.summary && formik.errors.summary ? formik.errors.summary : ""
                        }
                        {...formik.getFieldProps('summary')}
                    />

                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="update summary SuccessFull" color="success" />
                        ) : null
                    }
                    <Button size="large" variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}
                    </Button>
                </Stack>
            </Stack>

        </form >
    )
}

export default EditSummaryForm
