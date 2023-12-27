import { Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, ReminderChoiceActions } from '../../../contexts/dialogContext';
import { BackendError, Target } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { UpdateReminderWithMessage } from '../../../services/ReminderServices';
import { GetContacts } from '../../../services/ContactServices';
import FuzzySearch from "fuzzy-search";
import SelectContactPage from '../../../pages/reminders/SelectContactPage';
import { IReminder } from '../../../types/reminder.types';
import { IContact } from '../../../types/contact.types';
import { IUser } from '../../../types/user.types';


type TformData = {
    name: string,
    message: string,
    index_num:number,
    caption: string,
    media: string | Blob | File
    mobiles: string[]
}

function EditReminderForm({ reminder }: { reminder: IReminder }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, { id: string, body: FormData }>
        (UpdateReminderWithMessage, {
            onSuccess: () => {
                queryClient.invalidateQueries('reminders')
            }
        })
    const { data: contactsData, isLoading: isLoadingContacts } = useQuery<AxiosResponse<IContact[]>, BackendError>("contacts", GetContacts)

    const [contact, setContact] = useState<IContact>()
    const [contacts, setContacts] = useState<IContact[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => contacts, [contacts])
    const [preFilteredData, setPreFilteredData] = useState<IContact[]>([])
    const [selectedContacts, setSelectedContacts] = useState<IContact[]>([])
    const [filter, setFilter] = useState<string | undefined>()
    const [fileUrl, setFileUrl] = useState<string | undefined>(reminder.message.media?.public_url)
    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            name: reminder.name,
            index_num:reminder.index_num,
            message: reminder.message.message || "",
            caption: reminder.message.caption || "",
            media: "",
            mobiles: []
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            message: Yup.string(),
            caption: Yup.string(),
            mobiles: Yup.array().test("length", "must choose one mobile", mobiles_data => {
                if (mobiles_data?.length === 0)
                    return false
                else
                    return true
            }),
            media: Yup.mixed<File>()
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
            let formdata = new FormData()
            let Data = {
                name: values.name,
                index_num: values.index_num,
                message: values.message.replaceAll("\\n", "\n").replaceAll("\\t", "\t"),
                caption: values.caption.replaceAll("\\n", "\n").replaceAll("\\t", "\t"),
                mobiles: values.mobiles.toString().replaceAll("\n", ",").split(",")
            }

            formdata.append("body", JSON.stringify(Data))
            formdata.append("media", values.media)
            mutate({ id: reminder._id, body: formdata })
        }
    });

    useEffect(() => {
        if (fileUrl)
            setFileUrl(fileUrl)
    }, [fileUrl])


    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: ReminderChoiceActions.close_reminder })
            }, 1000)
        }
    }, [isSuccess, setChoice])

    useEffect(() => {
        if (contactsData) {
            setContacts(contactsData.data)
            setPreFilteredData(contactsData.data)
        }
    }, [contactsData])

    useEffect(() => {
        if (selectAll) {
            setSelectedContacts(MemoData)
        }
        if (!selectAll)
            setSelectedContacts([])
    }, [selectAll, setSelectAll])


    useEffect(() => {
        if (filter) {
            if (contacts) {
                const searcher = new FuzzySearch(contacts, ["name", "mobile", "created_by.username", "updated_by.username"], {
                    caseSensitive: false,
                });
                const result = searcher.search(filter);
                setContacts(result)
            }
        }
        if (!filter)
            setContacts(preFilteredData)

    }, [filter])


    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: ReminderChoiceActions.close_reminder })
            }, 1000)
        }
    }, [isSuccess, setChoice])


    useEffect(() => {
        let mobiles: string[] = []
        selectedContacts.forEach((contact) => {
            mobiles.push(contact.mobile.replace("91", "").replace("@c.us", ""))
        });
        formik.setValues({ name: formik.values.name, caption: formik.values.caption, media: formik.values.media, message: formik.values.message, mobiles: mobiles, index_num: formik.values.index_num })
    }, [selectedContacts])

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack sx={{ direction: { xs: 'column', md: 'row' } }}>
                <Stack
                    direction="column"
                    gap={2}
                    sx={{ p: 1 }}
                >
                    <TextField
                        type='number'
                        variant='outlined'
                        fullWidth
                        required
                        error={
                            formik.touched.index_num && formik.errors.index_num ? true : false
                        }
                        id="index_num"
                        label="Index"
                        helperText={
                            formik.touched.index_num && formik.errors.index_num ? formik.errors.index_num : ""
                        }
                        {...formik.getFieldProps('index_num')}
                    />
                    <TextField

                        variant='outlined'
                        fullWidth
                        required
                        error={
                            formik.touched.name && formik.errors.name ? true : false
                        }
                        id="name"
                        label="Reminder Name"
                        helperText={
                            formik.touched.name && formik.errors.name ? formik.errors.name : ""
                        }
                        {...formik.getFieldProps('name')}
                    />
                    <TextField
                        multiline
                        minRows={4}
                        fullWidth
                        error={
                            formik.touched.message && formik.errors.message ? true : false
                        }
                        id="message"
                        label="Message"
                        helperText={
                            formik.touched.message && formik.errors.message ? formik.errors.message :""
                        }
                        {...formik.getFieldProps('message')}
                    />
                    <TextField
                        multiline
                        minRows={4}
                        error={
                            formik.touched.caption && formik.errors.caption ? true : false
                        }
                        id="caption"
                        label="File Caption"
                        fullWidth
                        helperText={
                            formik.touched.caption && formik.errors.caption ? formik.errors.caption :""
                        }
                        {...formik.getFieldProps('caption')}
                    />

                    <TextField
                        fullWidth
                        error={
                            formik.touched.media && formik.errors.media ? true : false
                        }
                        helperText={
                            formik.touched.media && formik.errors.media ? String(formik.errors.media) : ""
                        }
                        label="Media"
                        focused
                        type="file"
                        name="media"
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                            e.preventDefault()
                            const target: Target = e.currentTarget
                            let files = target.files
                            if (files) {
                                let file = files[0]
                                formik.setFieldValue("media", file)
                                setFileUrl(URL.createObjectURL(file))
                            }
                        }}
                    />
                    <p style={{ color: 'red' }}>{formik.touched.mobiles && formik.errors.mobiles ? formik.errors.mobiles : ""}</p>
                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="custom reminder updated" color="success" />
                        ) : null
                    }
                    <Button variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update"}
                    </Button>

                    {isLoadingContacts ? "loading contacts..." :
                        <SelectContactPage
                            contact={contact}
                            selectAll={selectAll}
                            selectedContacts={selectedContacts}
                            setSelectedContacts={setSelectedContacts}
                            setSelectAll={setSelectAll}
                            contacts={MemoData}
                            setContact={setContact}
                            setFilter={setFilter}
                        />
                    }

                </Stack>
                {formik.values.media || formik.values.message || fileUrl ?
                    <Stack sx={{ bgcolor: 'black', maxWidth: '350px', p: 2 }}>
                        {formik.values.message && <Typography sx={{
                            p: 1, m: 1, bgcolor: 'lightgreen', border: 1,
                            whiteSpace: 'pre-wrap', borderColor: 'darkgreen', borderRadius: 1
                        }}>{formik.values.message.replaceAll("\\n", "\n").replaceAll("\\t", "\t")}</Typography>}
                        {fileUrl && <Stack sx={{ bgcolor: 'lightgreen', m: 1, p: 1, wordBreak: 'break-all', border: 5, borderColor: 'darkgreen', borderRadius: 2 }}>
                            {/* @ts-ignore */}
                            {fileUrl && <img src={fileUrl} alt="media" />}
                            {fileUrl && <Typography sx={{ py: 1, whiteSpace: 'pre-wrap' }}>{formik.values.caption.replaceAll("\\n", "\n").replaceAll("\\t", "\t")}</Typography>}
                        </Stack>}
                    </Stack> : null}
            </Stack>
        </form>
    )
}

export default EditReminderForm