import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { CreateOrEditBill,  GetAllStages } from '../../../services/LeadsServices';
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { toTitleCase } from '../../../utils/TitleCase';
import { DropDownDto } from '../../../dtos/common/dropdown.dto';
import { GetBillDto } from '../../../dtos/crm/crm.dto';


function CreateOrEditBillForm({ lead, bill, setDisplay2 }: { lead?: { _id: string, has_card?: boolean }, bill?: GetBillDto, setDisplay2?: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [display, setDisplay] = useState(false)
    const [card, setCard] = useState(Boolean(lead?.has_card))
    const [stages, setStages] = useState<DropDownDto[]>([])
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            lead_id?: string,
            bill_id?: string,
            body: FormData
        }>
        (CreateOrEditBill, {
            onSuccess: () => {
                queryClient.resetQueries('bills')
            }
        })
    const { data: stagedata, isSuccess: stageSuccess } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>("crm_stages", GetAllStages)

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        bill: string,
        remind_date?: string,
        stage: string,
        has_card: boolean
    }>({
        initialValues: {
            bill_no: bill ? bill.bill_no : "",
            bill_date: bill ? bill.bill_date : ""
        },
        validationSchema: Yup.object({
            stage: Yup.string().required("required field"),
            bill: Yup.string().required("required field")
                .min(5, 'Must be 5 characters or more')
                .max(200, 'Must be 200 characters or less')
                .required('Required field'),
            remind_date: Yup.string().test(() => {
                if (display && !formik.values.remind_date)
                    return false
                else
                    return true
            })
        }),
        onSubmit: (values: {
            bill: string,
            stage: string,
            lead_owners?: string[],
            remind_date?: string
        }) => {
            mutate({
                lead_id: lead && lead._id,
                bill_id: bill?._id,
                body: {
                    bill: values.bill,
                    has_card: card,
                    remind_date: values.remind_date,
                    stage: values.stage
                }
            })
        }
    });

    useEffect(() => {
        if (stageSuccess) {
            setStages(stagedata.data)
        }
    }, [isSuccess, stages, stagedata])


    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: LeadChoiceActions.close_lead })
            if (setDisplay2)
                setDisplay2(false);
            setCard(false)
        }
    }, [isSuccess, setChoice])
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                {/* bills */}
                <TextField
                    multiline
                    minRows={4}
                    required
                    error={
                        formik.touched.bill && formik.errors.bill ? true : false
                    }
                    autoFocus
                    id="bill"
                    label="Remark"
                    fullWidth
                    helperText={
                        formik.touched.bill && formik.errors.bill ? formik.errors.bill : ""
                    }
                    {...formik.getFieldProps('bill')}
                />
                {lead && <>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox
                            checked={Boolean(display)}
                            onChange={() => setDisplay(!display)}
                        />} label="Make Reminder" />
                    </FormGroup>
                    {display && < TextField
                        type="date"
                        error={
                            formik.touched.remind_date && formik.errors.remind_date ? true : false
                        }
                        focused
                        id="remind_date"
                        label="Remind Date"
                        fullWidth
                        helperText={
                            formik.touched.remind_date && formik.errors.remind_date ? formik.errors.remind_date : ""
                        }
                        {...formik.getFieldProps('remind_date')}
                    />}
                    <FormGroup>
                        <FormControlLabel control={<Checkbox
                            checked={Boolean(card)}
                            onChange={() => setCard(!card)}
                        />} label="Have a Visiting Card ?" />
                    </FormGroup>

                    {/* stage */}
                    < TextField
                        select
                        SelectProps={{
                            native: true
                        }}
                        focused

                        error={
                            formik.touched.stage && formik.errors.stage ? true : false
                        }
                        id="stage"
                        label="Stage"
                        fullWidth
                        helperText={
                            formik.touched.stage && formik.errors.stage ? formik.errors.stage : ""
                        }
                        {...formik.getFieldProps('stage')}
                    >
                        <option value="">

                        </option>
                        {
                            stages.map(stage => {
                                if (stage.value === "refer")
                                    return null
                                else
                                    return (<option key={stage.id} value={stage.value}>
                                        {toTitleCase(stage.label)}
                                    </option>)
                            })
                        }
                    </TextField>
                </>}


                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : !bill ? "Add Remark" : "Update Remark"}
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
                        {!bill ? <AlertBar message="new bill created" color="success" /> : <AlertBar message="bill updated" color="success" />}
                    </>
                ) : null
            }

        </form>
    )
}

export default CreateOrEditBillForm
