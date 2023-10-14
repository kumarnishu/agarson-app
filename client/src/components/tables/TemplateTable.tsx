import { Delete, Edit, RemoveRedEye } from '@mui/icons-material'
import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, TemplateChoiceActions } from '../../contexts/dialogContext'
import UpdateTemplateDialog from '../dialogs/templates/UpdateTemplateDialog'
import ViewTemplateDialog from '../dialogs/templates/ViewTemplateDialog'
import DeleteTemplateDialog from '../dialogs/templates/DeleteTemplateDialog'
import PopUp from '../popup/PopUp'
import { DownloadFile } from '../../utils/DownloadFile'
import { IMessageTemplate } from '../../types/template.types'
import { UserContext } from '../../contexts/userContext'

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
    const { user } = useContext(UserContext)
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
                            </TableCell>

                            {/* actions popup */}

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
                            </TableCell>




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
                            </TableCell>

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
                            </TableCell>

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
                            </TableCell>

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
                            </TableCell>

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
                                        {selectAll ?

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
                                        {!selectAll ?

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
                                        {!user?.templates_access_fields.is_readonly && user?.templates_access_fields.is_editable &&
                                            <TableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row" spacing={1}>
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
                                                    } />
                                            </TableCell>}

                                        {/* template name */}
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{template.name}</Typography>
                                        </TableCell>
                                        <TableCell title="double click to download"
                                        >
                                            {template.media && <img
                                                onDoubleClick={() => {
                                                    if (template.media && template.media?.public_url) {
                                                        DownloadFile(template.media?.public_url, template.media?.filename)
                                                    }
                                                }}
                                                src={template.media?.public_url} height="50" />}
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{template.categories.toString()}</Typography>
                                        </TableCell>
                                        {/* stage */}
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{template.message && template.message.slice(0, 50)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{template.caption && template.caption.slice(0, 50)}</Typography>
                                        </TableCell>

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