import { Delete, Edit, RemoveRedEye } from '@mui/icons-material'
import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, TemplateChoiceActions } from '../../contexts/dialogContext'
import { IMessageTemplate } from '../../types'
import { UserContext } from '../../contexts/userContext'
import UpdateTemplateDialog from '../dialogs/templates/UpdateTemplateDialog'
import ViewTemplateDialog from '../dialogs/templates/ViewTemplateDialog'
import DeleteTemplateDialog from '../dialogs/templates/DeleteTemplateDialog'
import PopUp from '../popup/PopUp'
import { useTemplateFields } from '../hooks/TemplateFieldsHooks'
import { DownloadFile } from '../../utils/DownloadFile'

type Props = {
    template: IMessageTemplate | undefined,
    setTemplate: React.Dispatch<React.SetStateAction<IMessageTemplate | undefined>>
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    templates: IMessageTemplate[],
    selectedTemplates: IMessageTemplate[]
    setSelectedTemplates: React.Dispatch<React.SetStateAction<IMessageTemplate[]>>,
}

function TemplatesTable({ templates, selectAll, template, setSelectAll, setTemplate, selectedTemplates, setSelectedTemplates }: Props) {
    const [data, setData] = useState<IMessageTemplate[]>(templates)
    const { setChoice } = useContext(ChoiceContext)
    const { user: LoggedInUser } = useContext(UserContext)
    const { readonlyFields, hiddenFields } = useTemplateFields()
    useEffect(() => {
        setData(templates)
    }, [templates])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '70vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ width: "1500px" }}
                    size="small">
                    <TableHead
                    >
                        <TableRow>
                            {!hiddenFields?.includes('Export To excel') &&
                                <TableCell
                                    sx={{ bgcolor: headColor }}                         >
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                        alignItems="left"
                                        spacing={2}
                                    >
                                        <FormControlLabel sx={{ fontSize: 12 }} control={
                                            <Checkbox
                                                indeterminate={selectAll ? true : false}
                                                size="small" onChange={(e) => {
                                                    if (e.currentTarget.checked) {
                                                        setSelectedTemplates(selectedTemplates)
                                                        setSelectAll(true)
                                                    }
                                                    if (!e.currentTarget.checked) {
                                                        setSelectedTemplates([])
                                                        setSelectAll(false)
                                                    }
                                                }} />}
                                            label=""
                                        />
                                    </Stack>
                                </TableCell>}

                            {/* actions popup */}
                            {!hiddenFields?.includes('Actions') &&
                                <TableCell
                                    sx={{ bgcolor: headColor }}                         >
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                        alignItems="left"
                                        spacing={2}
                                    >
                                        Actions
                                    </Stack>
                                </TableCell>}


                            {!hiddenFields?.includes('Template Name') &&

                                <TableCell
                                    sx={{ bgcolor: headColor }}                         >
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                        alignItems="left"
                                        spacing={2}
                                    >
                                        Template Name
                                    </Stack>
                                </TableCell>}
                            {!hiddenFields?.includes('media') &&
                                <TableCell
                                    sx={{ bgcolor: headColor }}                         >
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                        alignItems="left"
                                        spacing={2}
                                    >
                                        Media
                                    </Stack>
                                </TableCell>}
                            {!hiddenFields?.includes('Category') &&
                                <TableCell
                                    sx={{ bgcolor: headColor }}                         >
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                        alignItems="left"
                                        spacing={2}
                                    >
                                        Category
                                    </Stack>
                                </TableCell>}
                            {!hiddenFields?.includes('Message') &&
                                <TableCell
                                    sx={{ bgcolor: headColor }}                         >
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                        alignItems="left"
                                        spacing={2}
                                    >
                                        Message
                                    </Stack>
                                </TableCell>
                            }
                            {!hiddenFields?.includes('Caption') &&
                                <TableCell
                                    sx={{ bgcolor: headColor }}                         >
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                        alignItems="left"
                                        spacing={2}
                                    >
                                        Caption
                                    </Stack>
                                </TableCell>}

                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {

                            data && data.map((template, index) => {
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: color1 },
                                            '&:nth-of-type(even)': { bgcolor: color2 },
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                                        }}>
                                        {selectAll && !hiddenFields?.includes('Export To excel') ?

                                            <TableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                                </Stack>
                                            </TableCell>
                                            :
                                            null
                                        }
                                        {!selectAll && !hiddenFields?.includes('Export To excel') ?

                                            <TableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >
                                                    <Checkbox size="small"
                                                        onChange={(e) => {
                                                            setTemplate(template)
                                                            if (e.target.checked) {
                                                                setSelectedTemplates([...selectedTemplates, template])
                                                            }
                                                            if (!e.target.checked) {
                                                                setSelectedTemplates((templates) => templates.filter((item) => {
                                                                    return item._id !== template._id
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                </Stack>
                                            </TableCell>

                                            :
                                            null
                                        }
                                        {/* actions popup */}
                                        {!hiddenFields?.includes('Actions') &&
                                            <TableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row" spacing={1}>
                                                            {
                                                                LoggedInUser?.is_admin ?
                                                                    <>
                                                                        <Tooltip title="Edit">
                                                                            <IconButton color="info"
                                                                                onClick={() => {
                                                                                    setChoice({ type: TemplateChoiceActions.update_template })
                                                                                    setTemplate(template)
                                                                                }}
                                                                                disabled={readonlyFields?.includes('Edit')}
                                                                            >
                                                                                <Edit />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Delete">
                                                                            <IconButton color="error"
                                                                                onClick={() => {
                                                                                    setChoice({ type: TemplateChoiceActions.delete_template })
                                                                                    setTemplate(template)
                                                                                }}
                                                                                disabled={readonlyFields?.includes('Delete')}
                                                                            >
                                                                                <Delete />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="View">
                                                                            <IconButton color="success"
                                                                                onClick={() => {
                                                                                    setChoice({ type: TemplateChoiceActions.view_template })
                                                                                    setTemplate(template)
                                                                                }}
                                                                                disabled={readonlyFields?.includes('View')}
                                                                            >
                                                                                <RemoveRedEye />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </>
                                                                    :
                                                                    null
                                                            }
                                                        </Stack>
                                                    } />
                                            </TableCell>}

                                        {/* template name */}
                                        {!hiddenFields?.includes('Template Name') &&
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{template.name}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('media') &&
                                            <TableCell title="double click to download"
                                            >
                                                {template.media && <img
                                                    onDoubleClick={() => {
                                                        if (template.media && template.media?.public_url) {
                                                            DownloadFile(template.media?.public_url, template.media?.filename)
                                                        }
                                                    }}
                                                    src={template.media?.public_url} height="50" />}
                                            </TableCell>}
                                        {!hiddenFields?.includes('Category') &&
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{template.categories.toString()}</Typography>
                                            </TableCell>}
                                        {/* stage */}
                                        {!hiddenFields?.includes('Message') &&
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{template.message && template.message.slice(0, 50)}</Typography>
                                            </TableCell>}
                                        {!hiddenFields?.includes('Caption') &&
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{template.caption && template.caption.slice(0, 50)}</Typography>
                                            </TableCell>}

                                    </TableRow>
                                )
                            })

                        }
                    </TableBody>
                </Table>
                {template ?
                    <>
                        <UpdateTemplateDialog template={template} />
                        <ViewTemplateDialog template={template} />
                        <DeleteTemplateDialog template={template} />
                    </>
                    : null}
            </Box>
        </>
    )
}

export default TemplatesTable