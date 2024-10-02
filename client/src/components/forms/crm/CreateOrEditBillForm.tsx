import { Button, CircularProgress, Divider, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { CreateOrEditBill } from '../../../services/LeadsServices';
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext';
import { BackendError, Target } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { toTitleCase } from '../../../utils/TitleCase';
import { CreateOrEditBillItemDto, GetBillDto, GetLeadDto, GetReferDto } from '../../../dtos/crm/crm.dto';
import moment from 'moment';
import { IArticle } from '../../../types/production.types';
import { GetArticles } from '../../../services/ProductionServices';
import { Delete } from '@mui/icons-material';


function CreateOrEditBillForm({ lead, refer, setDisplay2, bill }: { lead?: GetLeadDto, refer?: GetReferDto, bill?: GetBillDto, setDisplay2?: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [items, setItems] = useState<CreateOrEditBillItemDto[]>(bill?.items || [])
    const [item, setItem] = useState<CreateOrEditBillItemDto>()
    const [articles, setArticles] = useState<IArticle[]>([])
    const { data: articlesData, isSuccess: isSucessArticles } = useQuery<AxiosResponse<IArticle[]>, BackendError>(["articles"], async () => GetArticles(String(false)))
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            body: FormData,
            id?: string,
        }>
        (CreateOrEditBill, {
            onSuccess: () => {
                queryClient.invalidateQueries('bills')
            }
        })


    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        lead?: string,
        billphoto: string,
        refer?: string,
        bill_no: string,
        bill_date: string,
        remarks: string,
    }>({
        initialValues: {
            lead: lead?._id,
            billphoto: "",
            refer: refer?._id,
            bill_no: bill ? bill.bill_no : "",
            remarks: bill ? bill.remarks : "",
            bill_date: bill ? moment(new Date(bill.bill_date)).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD"),
        },
        validationSchema: Yup.object({
            lead: Yup.string(),
            refer: Yup.string(),
            bill_no: Yup.string().required('required field'),
            remarks: Yup.string().required('required field'),
            bill_date: Yup.string().required('required field'),
            billphoto: Yup.mixed<File>()
                .test("size", "size is allowed only less than 10mb",
                    file => {
                        if (file)
                            if (!file.size) //file not provided
                                return true
                            else
                                return Boolean(file.size <= 20 * 1024 * 1024)
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
        onSubmit: (values) => {
            let body = {
                items: items,
                lead: values.lead,
                refer: values.refer,
                bill_no: values.bill_no,
                bill_date: values.bill_date,
                remarks: values.remarks,
            }
            let formdata = new FormData()
            formdata.append("body", JSON.stringify(body))
            if (values.billphoto)
                formdata.append("billphoto", values.billphoto)
            if (bill && bill._id)
                mutate({ id: bill?._id, body: formdata });
            else
                mutate({ body: formdata });
        }
    });

    const handleRemove = (itm: CreateOrEditBillItemDto) => {
        if (itm) {
            let tmp = items.filter((it) => { return it.article !== itm.article })
            setItems(tmp)
        }
    }
    const handleAdd = () => {
        let tmp = items;

        if (item && !items.find((it) => it.article === item.article)) {
            tmp.push(item)
            setItems(tmp)
            setItem(undefined)
        }
    }
    useEffect(() => {
        if (isSucessArticles && articlesData) {
            setArticles(articlesData.data)
        }
    }, [isSucessArticles])

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: LeadChoiceActions.close_lead })
            if (setDisplay2)
                setDisplay2(false);
        }
    }, [isSuccess, setChoice])
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                {/* remarks */}
                <TextField
                    required
                    error={
                        formik.touched.bill_no && formik.errors.bill_no ? true : false
                    }
                    autoFocus
                    id="bill_no"
                    label="Bill No"
                    fullWidth
                    helperText={
                        formik.touched.bill_no && formik.errors.bill_no ? formik.errors.bill_no : ""
                    }
                    {...formik.getFieldProps('bill_no')}
                />

                < TextField
                    type="date"
                    error={
                        formik.touched.bill_date && formik.errors.bill_date ? true : false
                    }
                    focused
                    required
                    id="bill_date"
                    label="Billing Date"
                    fullWidth
                    helperText={
                        formik.touched.bill_date && formik.errors.bill_date ? formik.errors.bill_date : ""
                    }
                    {...formik.getFieldProps('bill_date')}
                />
                <TextField
                    required
                    multiline
                    rows={2}
                    error={
                        formik.touched.remarks && formik.errors.remarks ? true : false
                    }
                    autoFocus
                    id="remarks"
                    label="Bill Remarks"
                    fullWidth
                    helperText={
                        formik.touched.remarks && formik.errors.remarks ? formik.errors.remarks : ""
                    }
                    {...formik.getFieldProps('remarks')}
                />
                <TextField
                    fullWidth
                    error={
                        formik.touched.billphoto && formik.errors.billphoto ? true : false
                    }
                    helperText={
                        formik.touched.billphoto && formik.errors.billphoto ? (formik.errors.billphoto) : ""
                    }
                    label="Bill"
                    focused

                    type="file"
                    name="billphoto"
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                        e.preventDefault()
                        const target: Target = e.currentTarget
                        let files = target.files
                        if (files) {
                            let file = files[0]
                            formik.setFieldValue("billphoto", file)
                        }
                    }}
                />
                <Divider />
                {/* bill items */}
                <Stack direction={'row'} gap={1}>
                    < TextField
                        select
                        SelectProps={{
                            native: true
                        }}
                        focused
                        id="article"
                        label="Articles"
                        fullWidth
                        value={item ? item.article : ""}
                        onChange={(e) => {
                            if (e.target.value)
                                //@ts-ignore
                                setItem({
                                    ...item,
                                    article: e.target.value
                                })
                        }}
                    >
                        <option value="" key={'00'}>
                            Select
                        </option>

                        {
                            articles && articles.map((art, index) => {
                                return <option key={index} value={art._id} >
                                    {toTitleCase(art.name)}
                                </option>

                            })
                        }
                    </TextField>

                    < TextField
                        type="number"
                        focused
                        id="qty"
                        value={item ? item.qty : 0}
                        onChange={(e) => {
                            if (e.target.value)
                                //@ts-ignore
                                setItem({
                                    ...item,
                                    qty: Number(e.target.value)
                                })
                        }}
                        label="Qty"
                        fullWidth
                    />
                    < TextField
                        type="number"
                        focused
                        id="rate"
                        label="Rate"
                        onChange={(e) => {
                            if (e.target.value)
                                //@ts-ignore
                                setItem({
                                    ...item,
                                    rate: Number(e.target.value)
                                })
                        }}
                        fullWidth
                        value={item ? item.rate : 0}
                    />
                    <Button size="small" variant='contained' onClick={handleAdd}>+</Button>
                </Stack>
                <>
                    {items && items.map((it, index) => {
                        return <Stack key={index}>
                            <Stack direction={'row'} gap={1}>
                                < TextField
                                    select
                                    SelectProps={{
                                        native: true
                                    }}
                                    disabled
                                    focused
                                    required
                                    id="article"
                                    label="Articles"
                                    fullWidth
                                    value={it ? it.article : ""}
                                >
                                    <option value="" key={'00'}>
                                        Select
                                    </option>

                                    {
                                        articles && articles.map((art, index) => {
                                            return <option key={index} value={art._id} >
                                                {toTitleCase(art.name)}
                                            </option>

                                        })
                                    }
                                </TextField>

                                < TextField
                                    required
                                    type="number"
                                    focused
                                    id="qty"
                                    value={it ? it.qty : 0}
                                    label="Qty"
                                    fullWidth
                                    disabled
                                />
                                < TextField
                                    required
                                    type="number"
                                    focused
                                    id="rate"
                                    label="Rate"
                                    fullWidth
                                    disabled
                                    value={it ? it.rate : 0}
                                />
                                <Button size="small" variant='contained' onClick={() => handleRemove({ ...it, _id: String(index) })}><Delete /></Button>
                            </Stack>
                        </Stack>
                    })}
                </>
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : !bill ? "Submit" : "Update "}
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

        </form >
    )
}

export default CreateOrEditBillForm
