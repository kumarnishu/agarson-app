import React from "react"
import { Button, CircularProgress, Stack } from "@mui/material"
import styled from "styled-components"


type Props = {
    disabled: boolean,
    file: File | undefined,
    label: string,
    name: string,
    isLoading: boolean,
    camera: boolean,
    required: boolean,
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>,
}

const FileInput = styled.input`
background:none;
color:blue;
`

function UploadFileButton({ disabled, file, name, required, camera, label, isLoading, setFile }: Props) {
    return (
        <>
            {
                isLoading ?
                    <CircularProgress />
                    :
                    <>
                        <Button
                            fullWidth
                            color="warning"
                            variant="outlined"
                            component="label"
                            disabled={Boolean(disabled)}
                        >
                            {label}
                            {camera ?
                                <FileInput
                                    id={name}
                                    hidden
                                    required={required}
                                    name={name}
                                    capture={"environment"}
                                    accept="image/*"
                                    type="file"
                                    onChange={
                                        (e: any) => {
                                            if (e.currentTarget.files) {
                                                setFile(e.currentTarget.files[0])
                                            }
                                        }}>
                                </FileInput > :
                                <FileInput
                                    id={name}
                                    required={required}
                                    name={name}
                                    hidden
                                    type="file"
                                    onChange={
                                        (e: any) => {
                                            if (e.currentTarget.files) {
                                                setFile(e.currentTarget.files[0])
                                            }
                                        }}>
                                </FileInput >
                            }

                        </Button>
                        {file && <Stack sx={{ bgcolor: 'lightblue', m: 1, p: 1 }}>
                            {file && <img src={file && URL.createObjectURL(file)} alt="image" />}
                        </Stack>
                        }
                    </>
            }
        </>
    )
}

export default UploadFileButton