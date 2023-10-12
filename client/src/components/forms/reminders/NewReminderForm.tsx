import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, ReminderChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { IContact, IMessageTemplate, IUser } from '../../../types';
import { queryClient } from '../../../main';
import { GetTemplates } from '../../../services/TemplateServices';
import AlertBar from '../../snacks/AlertBar';
import { CreateReminder } from '../../../services/ReminderServices';
import { GetContacts } from '../../../services/ContactServices';
import FuzzySearch from "fuzzy-search";
import SelectContactPage from '../../../pages/reminders/SelectContactPage';


type TformData = {
    name: string,
    templates: string[],
    mobiles: string[]
}

function NewReminderForm() {
    const { data, isLoading: isLoadingtemplates } = useQuery<AxiosResponse<IMessageTemplate[]>, BackendError>("templates", GetTemplates)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, FormData>
        (CreateReminder, {
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

    const [extemplates, setExtemplates] = useState<IMessageTemplate[]>()
    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            name: "",
            templates: [],
            mobiles: []
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            templates: Yup.array().required('Required field'),
            mobiles: Yup.array().test("length", "must choose one mobile", mobiles_data => {
                if (mobiles_data?.length === 0)
                    return false
                else
                    return true
            })

        }),
        onSubmit: (values: TformData) => {
            let formdata = new FormData()
            let Data: TformData | undefined = {
                name: values.name,
                templates: values.templates,
                mobiles: values.mobiles
            }
            formdata.append("body", JSON.stringify(Data))
            mutate(formdata)
        }
    });

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
        if (data) {
            setExtemplates(data.data)
        }
    }, [data])

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
        formik.setValues({ name: formik.values.name, templates: formik.values.templates, mobiles: mobiles })
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
                    < TextField
                        select
                        SelectProps={{
                            native: true,
                            multiple: true
                        }}
                        focused
                        disabled={isLoadingtemplates}
                        error={
                            formik.touched.templates && formik.errors.templates ? true : false
                        }
                        id="templates"
                        label="Templates"
                        fullWidth
                        required
                        helperText={
                            formik.touched.templates && formik.errors.templates ? formik.errors.templates : ""
                        }
                        {...formik.getFieldProps('templates')}
                    >
                        <React.Fragment>
                            {
                                extemplates && extemplates.map((item, index) => {
                                    return (
                                        <option key={index} value={item._id}>
                                            {item.name}
                                        </option>
                                    )
                                })
                            }
                        </React.Fragment>
                    </TextField>
                    <p style={{ color: 'red' }}>{formik.touched.mobiles && formik.errors.mobiles ? formik.errors.mobiles : ""}</p>
                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="new template reminder created" color="success" />
                        ) : null
                    }
                    <Button variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create"}
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
            </Stack>
        </form>
    )
}

export default NewReminderForm