import { AxiosResponse } from "axios"
import React from "react"
import { useMutation } from "react-query"
import { styled } from "styled-components"
import { BackendError } from "../.."
import {  BulkReferUpdateFromExcel } from "../../services/LeadsServices"
import { Button, Snackbar, Tooltip } from "@mui/material"
import ExportToExcel from "../../utils/ExportToExcel"
import { Upload } from "@mui/icons-material"
import {  IReferTemplate } from "../../types/template.type"

const FileInput = styled.input`
background:none;
color:blue;
`
function UploadRefersExcelButton() {
  const [leads, setLeads] = React.useState<IReferTemplate[]>()
  const { data, mutate, isLoading, isSuccess, isError, error } = useMutation
    <AxiosResponse<IReferTemplate[]>, BackendError, FormData>
    (BulkReferUpdateFromExcel)
  const [file, setFile] = React.useState<File | null>(null)


  function handleFile() {
    if (file) {
      let formdata = new FormData()
      formdata.append('file', file)
      mutate(formdata)
    }
  }
  React.useEffect(() => {
    if (file) {
      handleFile()
    }
  }, [file])


  React.useEffect(() => {
    if (data) {
      setLeads(data.data)
    }
  }, [data, leads])

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
         <p style={{color:'blue',paddingTop:'10px'}}>processing...</p>
          :
          <>
            <Button
              size="small"
              
              component="label"
            >
              <Tooltip title="upload excel template">
                <Upload />
              </Tooltip>
              <FileInput
                id="upload_input"
                hidden
                type="file"
                name="file"
                onChange={
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

export default UploadRefersExcelButton