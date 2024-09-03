import { Button, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import UploadFileButton from '../../buttons/UploadFileButton';
import { CreateShoeWeight,  GetDyeById, GetDyes, GetMachines } from '../../../services/ProductionServices';
import { IArticle, IDye, IMachine } from '../../../types/production.types';
import { months } from '../../../utils/months';
import { GetUserDto } from '../../../dtos/users/user.dto';


type TformData = {
    machine: string,
    dye: string,
    article: string,
    month: number,
    weight: number,
    st_weight: number,
    upper_weight: number
}

function CreateShoeWeightForm({ useddyes }: { useddyes: string[] }) {
    const [file, setFile] = useState<File>()
    const [articles,setArticles]=useState<IArticle[]>([])
    const [dyeid, setDyeid] = useState<string>('');
    const { data: dyedata, refetch: refetchDye } = useQuery<AxiosResponse<IDye>, BackendError>(["dye", dyeid], async () => GetDyeById(dyeid), { enabled: false })
    const { data: dyes } = useQuery<AxiosResponse<IDye[]>, BackendError>("dyes", async () => GetDyes())
    const { data: machines } = useQuery<AxiosResponse<IMachine[]>, BackendError>("machines", async () => GetMachines())
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<GetUserDto>, BackendError, {
            body: FormData;
        }>
        (CreateShoeWeight, {
            onSuccess: () => {
                queryClient.invalidateQueries('shoe_weights')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            machine: "",
            dye: "",
            article: "",
            month: new Date().getMonth(),
            weight: 0,
            upper_weight:0,
            st_weight: 0
        },
        validationSchema: Yup.object({
            weight: Yup.number().required("required weight"),
            st_weight: Yup.number().required("required St weight"),
            upper_weight: Yup.number().required("required Upper Weight"),
            machine: Yup.string().required("required machine"),
            article: Yup.string().required("required article"),
            dye: Yup.string().required("required dye"),
            month: Yup.number().required("required clock in")

        }),
        onSubmit: (values: TformData) => {
            if (file) {
                let formdata = new FormData()
                let Data = {
                    weight: values.weight,
                    article: values.article,
                    month: values.month,
                    dye: values.dye,
                    upper_weight: values.upper_weight,
                    machine: values.machine,
                    st_weight: values.st_weight
                }
                formdata.append("body", JSON.stringify(Data))
                formdata.append("media", file)
                mutate({ body: formdata })
                setFile(undefined)
            }
            else {
                alert("Upload a file")
            }
        }
    });

    useEffect(() => {
        if (file)
            setFile(file)
    }, [file])

    useEffect(() => {
        if (formik.values.dye)
            setDyeid(formik.values.dye)
    }, [formik.values.dye])

    useEffect(() => {
        refetchDye()
    }, [dyeid])

    useEffect(() => {
        if (dyedata) {
            formik.setFieldValue('st_weight', dyedata.data.stdshoe_weight);
            setArticles(dyedata.data.articles)
        }
        else {
            formik.setFieldValue('st_weight', undefined);
            setArticles([])
        }
    }, [dyedata])
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: ProductionChoiceActions.close_production })
            }, 1000)
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
                    {/* machine */}
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
                                    {machine.display_name}
                                </option>)

                            })
                        }
                    </TextField>
                    < TextField
                        select

                        SelectProps={{
                            native: true,
                        }}
                        error={
                            formik.touched.dye && formik.errors.dye ? true : false
                        }
                        id="dye"
                        helperText={
                            formik.touched.dye && formik.errors.dye ? formik.errors.dye : ""
                        }
                        {...formik.getFieldProps('dye')}
                        required
                        label="Select Dye"
                        fullWidth
                    >
                        <option key={'00'} value={undefined}>
                        </option>
                        {

                            dyes && dyes.data && dyes.data.map((dye, index) => {
                                if (!useddyes.includes(dye._id)) {
                                    console.log(dye._id)
                                    return (<option key={index} value={dye._id}>
                                        {dye.dye_number}
                                    </option>)
                                }
                            })
                        }
                    </TextField>
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
                            articles  && articles.map((article, index) => {
                                return (<option key={index} value={article && article._id}>
                                    {article.display_name}
                                </option>)
                            })
                        }
                    </TextField>
                    {/* dyes */}

                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        disabled
                        focused
                        label="St Weight"
                        error={
                            formik.touched.st_weight && formik.errors.st_weight ? true : false
                        }
                        id="St Weight"
                        helperText={
                            formik.touched.st_weight && formik.errors.st_weight ? formik.errors.st_weight : ""
                        }
                        {...formik.getFieldProps('st_weight')}
                    />

                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        focused
                        label="Upper Weight"
                        error={
                            formik.touched.upper_weight && formik.errors.upper_weight ? true : false
                        }
                        id="Upper Weight"
                        helperText={
                            formik.touched.upper_weight && formik.errors.upper_weight ? formik.errors.upper_weight : ""
                        }
                        {...formik.getFieldProps('upper_weight')}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        label="Shoe Weight"
                        error={
                            formik.touched.weight && formik.errors.weight ? true : false
                        }
                        id="weight"
                        helperText={
                            formik.touched.weight && formik.errors.weight ? formik.errors.weight : ""
                        }
                        {...formik.getFieldProps('weight')}
                    />
                    < TextField
                        select

                        SelectProps={{
                            native: true,
                        }}
                        error={
                            formik.touched.month && formik.errors.month ? true : false
                        }
                        id="month"
                        helperText={
                            formik.touched.month && formik.errors.month ? formik.errors.month : ""
                        }
                        {...formik.getFieldProps('month')}
                        required
                        label="Clock In"
                        fullWidth
                    >
                        <option key={'00'} value={undefined}>
                        </option>
                        {
                            months.map((month, index) => {
                                return (<option key={index} value={month.month}>
                                    {month.label}
                                </option>)
                            })
                        }
                    </TextField>
                    <UploadFileButton name="media" required={true} camera={true} isLoading={isLoading} label="Upload Shoe Weight Photo" file={file} setFile={setFile} disabled={isLoading} />

                    {
                        isError ? (
                            <AlertBar message={error?.response.data.message} color="error" />
                        ) : null
                    }
                    {
                        isSuccess ? (
                            <AlertBar message="Added Shoe weight" color="success" />
                        ) : null
                    }
                    <Button size="large" variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? "Saving" : "Submit"}
                    </Button>
                </Stack>
            </Stack>
        </form >
    )
}

export default CreateShoeWeightForm
