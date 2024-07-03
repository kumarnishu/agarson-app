import { AxiosResponse } from "axios"
import React from "react"
import { useMutation } from "react-query"
import { styled } from "styled-components"
import { BackendError } from "../.."
import { Button, CircularProgress, Snackbar } from "@mui/material"
import { Upload } from "@mui/icons-material"
import { BulkCityUpdateFromExcel } from "../../services/LeadsServices"
import ExportToExcel from "../../utils/ExportToExcel"

const FileInput = styled.input`
background:none;
color:blue;
`
function UploadCRMCitiesFromExcelButton({ disabled,state }: { disabled: boolean ,state?:string}) {
    const {data, mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<any[]>, BackendError, {state:string,body:FormData}>
        (BulkCityUpdateFromExcel)
    const [file, setFile] = React.useState<File | null>(null)


    function handleFile() {
        if (!state){
            alert("select a state first");
            return;
        }
        if (file) {
            let formdata = new FormData()
            formdata.append('file', file)
            mutate({state:state,body:formdata})
        }
    }
    React.useEffect(() => {
        if (file) {
            handleFile()
        }
    }, [file])

    React.useEffect(() => {
        if (isSuccess) {
            if (data.data.length > 0)
                ExportToExcel(data.data, "upload_output")
        }
    }, [isSuccess])

    return (
        <>

            <Snackbar
                open={isSuccess}
                autoHideDuration={6000}
                onClose={() => setFile(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                message="Uploaded Successfuly wait for some minutes"
            />

            <Snackbar
                open={isError}
                autoHideDuration={6000}
                onClose={() => setFile(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                message={error?.response.data.message}
            />
            {
                isLoading ?
                    <CircularProgress />
                    :
                    <>
                        <Button
                            component="label"
                            disabled={Boolean(disabled)}
                        >
                            <Upload />
                            <FileInput
                                id="upload_input"
                                hidden
                                type="file" required name="file" onChange={
                                    (e: any) => {
                                        if (e.currentTarget.files) {
                                            setFile(e.currentTarget.files[0])
                                        }
                                    }}>
                            </FileInput >
                        </Button>
                    </>
            }
        </>
    )
}

export default UploadCRMCitiesFromExcelButton