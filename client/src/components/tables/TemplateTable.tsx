import { Delete, Edit, RemoveRedEye } from '@mui/icons-material'
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, TemplateChoiceActions } from '../../contexts/dialogContext'
import UpdateTemplateDialog from '../dialogs/templates/UpdateTemplateDialog'
import ViewTemplateDialog from '../dialogs/templates/ViewTemplateDialog'
import DeleteTemplateDialog from '../dialogs/templates/DeleteTemplateDialog'
import { DownloadFile } from '../../utils/DownloadFile'
import { IMessageTemplate } from '../../types/template.types'
import { UserContext } from '../../contexts/userContext'

type Props = {
    template: IMessageTemplate | undefined,
    setTemplate: React.Dispatch<React.SetStateAction<IMessageTemplate | undefined>>
    templates: IMessageTemplate[],
}

function TemplatesTable({ templates, template, setTemplate }: Props) {
    const [data, setData] = useState<IMessageTemplate[]>(templates)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)

    useEffect(() => {
        setData(templates)
    }, [templates])

    return (
        <>
            <Box sx={{ bgcolor: "white", m: 0, pt: 2 }}>
                <Grid container >
                    {

                        data && data.map((template, index) => {
                            return (
                                <Grid key={index} item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                                    <Stack sx={{ bgcolor: 'white', position: 'relative', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }} gap={1}>
                                        <Typography variant="subtitle1">{template.name}</Typography>
                                        {template.media && <img
                                            onDoubleClick={() => {
                                                if (template.media && template.media?.public_url) {
                                                    DownloadFile(template.media?.public_url, template.media?.filename)
                                                }
                                            }}
                                            src={template.media?.public_url} height="180" style={{ borderRadius: '10px' }} />}
                                        {!user?.templates_access_fields.is_hidden &&
                                            <Stack direction="row" spacing={1} sx={{ position: 'relative', top: 10 }}>
                                                {

                                                    <>
                                                        <Tooltip title="Edit">
                                                            <IconButton color="info"
                                                                onClick={() => {
                                                                    setChoice({ type: TemplateChoiceActions.update_template })
                                                                    setTemplate(template)
                                                                }}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {user?.templates_access_fields.is_deletion_allowed &&
                                                            <Tooltip title="Delete">
                                                                <IconButton color="error"
                                                                    onClick={() => {
                                                                        setChoice({ type: TemplateChoiceActions.delete_template })
                                                                        setTemplate(template)
                                                                    }}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </Tooltip>}
                                                        <Tooltip title="View">
                                                            <IconButton color="success"
                                                                onClick={() => {
                                                                    setChoice({ type: TemplateChoiceActions.view_template })
                                                                    setTemplate(template)
                                                                }}
                                                            >
                                                                <RemoveRedEye />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>

                                                }
                                            </Stack>
                                        }
                                    </Stack>
                                </Grid>
                            )
                        })
                    }
                </Grid>
                {template ?
                    <>
                        <UpdateTemplateDialog template={template} />
                        <ViewTemplateDialog template={template} />
                        <DeleteTemplateDialog template={template} />
                    </>
                    : null}
            </Box >
        </>
    )
}

export default TemplatesTable