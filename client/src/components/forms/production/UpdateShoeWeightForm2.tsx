import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, ProductionChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IUser } from '../../../types/user.types';
import { GetArticles, GetDyes, GetMachines,  UpdateShoeWeight2 } from '../../../services/ProductionServices';
import { IArticle, IDye, IMachine, IShoeWeight } from '../../../types/production.types';
import { months } from '../../../utils/months';
import UploadFileButton from '../../buttons/UploadFileButton';


type TformData = {
    machine: string,
    dye: string,
    month: number,
    article: string,
    weight: number,
    st_weight: number,
    upper_weight: number
}

function UpdateShoeWeightForm2({ shoe_weight }: { shoe_weight: IShoeWeight }) {
    const { data: dyes } = useQuery<AxiosResponse<IDye[]>, BackendError>("dyes", async () => GetDyes())
    const { data: machines } = useQuery<AxiosResponse<IMachine[]>, BackendError>("machines", async () => GetMachines())
    const [file, setFile] = useState<File>()
    const { data: articles } = useQuery<AxiosResponse<IArticle[]>, BackendError>("articles", async () => GetArticles())
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IUser>, BackendError, {
            id: string,
            body: FormData
        }>
        (UpdateShoeWeight2, {
            onSuccess: () => {
                queryClient.invalidateQueries('shoe_weights')
            }
        })

    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<TformData>({
        initialValues: {
            machine: shoe_weight.machine._id,
            dye: shoe_weight.dye._id,
            month: shoe_weight.month,
            article: shoe_weight.article._id,
            weight: shoe_weight.shoe_weight2,
            upper_weight:shoe_weight.upper_weight2,
            st_weight: shoe_weight.dye&& shoe_weight.dye.stdshoe_weight
        },
        validationSchema: Yup.object({
            weight: Yup.number().required("required weight"),
            st_weight: Yup.number().required("required St weight"),
            machine: Yup.string().required("required machine"),
            article: Yup.string().required("required article"),
            upper_weight: Yup.number().required("required Upper Weight"),
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
                    upper_weight:values.upper_weight,
                    machine: values.machine,
                    st_weight: values.st_weight
                }
                formdata.append("body", JSON.stringify(Data))
                formdata.append("media", file)
                mutate({ id: shoe_weight._id, body: formdata })
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
    console.log(shoe_weight)
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
                        disabled
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
                    {/* dyes */}
                    < TextField
                        select

                        SelectProps={{
                            native: true,
                        }}
                        disabled
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
                                return (<option key={index} value={dye._id}>
                                    {dye.dye_number}
                                </option>)

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
                        disabled
                        fullWidth
                    >
                        <option key={'00'} value={undefined}>
                        </option>
                        {
                            articles && articles.data && articles.data.map((article, index) => {
                                return (<option key={index} value={article._id}>
                                    {article.display_name}
                                </option>)
                            })
                        }
                    </TextField>
                   
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
                        disabled
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
                            <AlertBar message="Updated Shoe weight" color="success" />
                        ) : null
                    }
                    <Button size="large" variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update"}
                    </Button>
                </Stack>
            </Stack>
        </form >
    )
}

export default UpdateShoeWeightForm2
