import React, { useContext, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import { BackendError } from '../../..'
import { CreateFlow } from '../../../services/BotServices'
import { BotChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { IFlow } from '../../../types'
import { Button, Dialog, DialogContent, DialogTitle, Snackbar, TextField } from '@mui/material'
import { queryClient } from '../../../main'

type Props = {
    setFlow: React.Dispatch<React.SetStateAction<IFlow | undefined>>,
    flow: IFlow,
    setDisplaySaveModal: React.Dispatch<React.SetStateAction<boolean>>

}
function SaveNewFlowDialog({ flow, setFlow, setDisplaySaveModal }: Props) {
    const { setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IFlow>,
            BackendError,
            IFlow
        >(CreateFlow,{
            onSuccess: () => queryClient.invalidateQueries('flows')
        })

    const formik = useFormik<IFlow>({
        initialValues: {
            flow_name: flow.flow_name,
            trigger_keywords: flow.trigger_keywords,
            nodes: flow.nodes,
            edges: flow.edges
        },
        validationSchema: Yup.object({
            flow_name: Yup.string()
                .min(4, 'Must be 4 characters or more')
                .required("name is required")

        }),
        onSubmit: (values: {
            flow_name: string,
        }) => {
            mutate({
                ...flow,
                flow_name: values.flow_name
            })
        },
    });

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setDisplaySaveModal(false)
                setChoice({ type: BotChoiceActions.close_bot })
                setFlow(undefined)
            }, 400)
        }
    }, [isSuccess, setFlow, setChoice, setDisplaySaveModal])
    
    return (

        <Dialog open={flow ? true : false}
            onClose={() => setChoice({ type: BotChoiceActions.close_bot })}
        >
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>
                    Save Flow
                </DialogTitle>
                {
                    isError ? (
                        <Snackbar
                            color='danger'
                            open={true}
                            autoHideDuration={6000}
                            onClose={() => null}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            message={error?.response.data.message}
                        />

                    ) : null
                }
                {
                    isSuccess ? (
                        <Snackbar
                            color='success'
                            open={true}
                            autoHideDuration={6000}
                            onClose={() => null}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            message=" Flow saved in the store"
                        />
                    ) : null
                }

                <DialogContent>
                    < TextField
                        variant='standard'
                        focused
                        required
                        error={
                            formik.touched.flow_name && formik.errors.flow_name ? true : false
                        }
                        id="flow_name"
                        label="Flow Name"
                        fullWidth
                        helperText={
                            formik.touched.flow_name && formik.errors.flow_name ? formik.errors.flow_name : ""
                        }
                        {...formik.getFieldProps('flow_name')}
                    />
                    <Button sx={{ mt: 2 }} fullWidth variant="contained" type="submit"
                        disabled={isLoading}
                    >{isLoading ? "saving..." : "Change"}</Button>
                </DialogContent>

            </form>
        </Dialog>
    )
}

export default SaveNewFlowDialog