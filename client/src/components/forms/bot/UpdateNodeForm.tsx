import { useFormik } from 'formik';
import * as Yup from "yup"
import { Node } from 'reactflow';
import { Button,  Stack, TextField } from '@mui/material';

type Props = {
    selectedNode: Node,
    updateNode: (index: number, media_value: string, media_type?: string) => void,
    setDisplayNodeUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
}

function UpdateNodeForm({ updateNode, selectedNode, setDisplayNodeUpdateModal }: Props) {
    const formik = useFormik({
        initialValues: {
            index: selectedNode.data.index || 1,
            media_type: selectedNode.data.media_type,
            media_value: selectedNode.data.media_value || "message"
        },
        validationSchema: Yup.object({
            index: Yup.number().required("this is required"),
            media_value: Yup.string()
                .required("this is required"),
            media_type: Yup.string()
                .required("this is required")
        }),
        onSubmit: (values: {
            index: number,
            media_type: string,
            media_value: string
        }) => {
            updateNode(values.index, values.media_value, values.media_type)
            setDisplayNodeUpdateModal(false)
        },
    });
    return (
        <form onSubmit={formik.handleSubmit} >
           
            <Stack gap={2} pt={2}>
                < TextField
                    
                    required
                    multiline
                    minRows={2}
                    error={
                        formik.touched.media_value && formik.errors.media_value ? true : false
                    }
                    id="media_value"
                    label="Message"
                    placeholder='Message or Media Url'
                    fullWidth
                    helperText={
                        formik.touched.media_value && formik.errors.media_value ? formik.errors.media_value : ""
                    }
                    {...formik.getFieldProps('media_value')}
                />
                < TextField
                    
                    required
                    error={
                        formik.touched.index && formik.errors.index ? true : false
                    }
                    id="index"
                    label="Index"
                    placeholder='Message or Media Url'
                    fullWidth
                    helperText={
                        formik.touched.index && formik.errors.index ? formik.errors.index : ""
                    }
                    {...formik.getFieldProps('index')}
                />
                < TextField
                    select
                    SelectProps={{
                        native: true
                    }}
                    
                    error={
                        formik.touched.media_type && formik.errors.media_type ? true : false
                    }
                    id="media_type"
                    label="Media Type"
                    fullWidth
                    helperText={
                        formik.touched.media_type && formik.errors.media_type ? formik.errors.media_type : "videos,gifts and stickers not supported"
                    }
                    {...formik.getFieldProps('media_type')}
                >
                    <option value="message">Message</option>
                    <option value="media">Media</option>
                </TextField>
                <Button variant="contained" fullWidth type="submit"
                >Update</Button>
            </Stack>
        </form>
    )
}

export default UpdateNodeForm

