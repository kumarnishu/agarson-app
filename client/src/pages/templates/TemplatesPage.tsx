import { Delete, Edit, RemoveRedEye, Search } from '@mui/icons-material'
import { Box, Fade, Grid, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { headColor } from '../../utils/colors'
import FuzzySearch from "fuzzy-search";
import { BackendError } from '../..'
import { GetTemplates } from '../../services/TemplateServices'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, TemplateChoiceActions } from '../../contexts/dialogContext'
import NewTemplateDialog from '../../components/dialogs/templates/NewTemplateDialog'
import { IMessageTemplate } from '../../types/template.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { DownloadFile } from '../../utils/DownloadFile'
import { UserContext } from '../../contexts/userContext'
import UpdateTemplateDialog from '../../components/dialogs/templates/UpdateTemplateDialog'
import ViewTemplateDialog from '../../components/dialogs/templates/ViewTemplateDialog'
import DeleteTemplateDialog from '../../components/dialogs/templates/DeleteTemplateDialog'




export default function TemplatesPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IMessageTemplate[]>, BackendError>("templates", GetTemplates)
  const [template, setTemplate] = useState<IMessageTemplate>()
  const [templates, setTemplates] = useState<IMessageTemplate[]>([])
  const MemoData = React.useMemo(() => templates, [templates])
  const [preFilteredData, setPreFilteredData] = useState<IMessageTemplate[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user } = useContext(UserContext)

  useEffect(() => {
    setTemplate(template)
  }, [template])

  useEffect(() => {
    if (isSuccess) {
      setTemplates(data.data)
      setPreFilteredData(data.data)
     
    }
  }, [isSuccess, templates, data])

  useEffect(() => {
    if (filter) {
      if (templates) {
        const searcher = new FuzzySearch(templates, ["name", "message", "caption"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setTemplates(result)
      }
    }
    if (!filter)
      setTemplates(preFilteredData)

  }, [filter, templates])
 
  return (
    <>
      {
        isLoading && <LinearProgress />
      }
      {/*heading, search bar and table menu */}
      <Stack
        spacing={2}
        padding={1}
        direction="row"
        justifyContent="space-between"
        width="100vw"
      >
        <Typography
          variant={'h6'}
          component={'h1'}
          sx={{ pl: 1 }}
        >
          Templates
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2} sx={{ bgcolor: headColor }
          }>
            <TextField
              fullWidth
              size="small"
              onChange={(e) => setFilter(e.currentTarget.value)}
              autoFocus
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <Search />
                </InputAdornment>,
              }}
              placeholder={`${MemoData?.length} records...`}
              style={{
                fontSize: '1.1rem',
                border: '0',
              }}
            />
          </Stack >
          {/* menu */}
          <>
            <IconButton size="medium"
              onClick={(e) => setAnchorEl(e.currentTarget)
              }
              sx={{ border: 1, borderRadius: 2, marginLeft: 2 }}
            >
              <MenuIcon />
            </IconButton>
            {user?.templates_access_fields.is_editable&&

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)
              }
              TransitionComponent={Fade}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              sx={{ borderRadius: 2 }}>
              <MenuItem onClick={() => {
                setChoice({ type: TemplateChoiceActions.create_template })
                setAnchorEl(null)
              }}
              >New Template</MenuItem>
            </Menu>}
            <NewTemplateDialog />
          </>

        </Stack>
      </Stack>
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading && 
        <Box sx={{ bgcolor: "white", m: 0, pt: 2 }}>
          <Grid container >
            {

              templates && templates.map((template, index) => {
                return (
                  <Grid key={index} item xs={12} md={3} lg={3} sx={{ p: 1 }}>
                    <Stack sx={{ bgcolor: 'white', position: 'relative', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }} gap={1}>
                      <Typography variant="subtitle1">{template.name}</Typography>
                      {template.media && <img
                        onDoubleClick={() => {
                          if (template.media && template.media?.public_url) {
                            DownloadFile(template.media?.public_url, template.media?.filename)
                          }
                        }}
                        src={template.media?.public_url} style={{ borderRadius: '10px', minHeight: '260px' }} />}
                     
                        <Stack direction="row" spacing={1} sx={{ position: 'relative', top: 10 }}>
                          {

                            <>
                            {user?.templates_access_fields.is_editable &&<Tooltip title="Edit">
                                <IconButton color="info"
                                  onClick={() => {
                                    setChoice({ type: TemplateChoiceActions.update_template })
                                    setTemplate(template)
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>}
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
        </Box >}
    </>

  )

}

