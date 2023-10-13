import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem,  TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { headColor } from '../../utils/colors'
import FuzzySearch from "fuzzy-search";
import { BackendError } from '../..'
import TemplatesTable from '../../components/tables/TemplateTable'
import { GetTemplates } from '../../services/TemplateServices'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, TemplateChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import NewTemplateDialog from '../../components/dialogs/templates/NewTemplateDialog'
import ReactPagination from '../../components/pagination/ReactPagination'
import AlertBar from '../../components/snacks/AlertBar'
import { IMessageTemplate } from '../../types/template.types'



type SelectedData = {
  name?: string,
  message?: string,
  caption?: string,
  media?: string
}

export default function TemplatesPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IMessageTemplate[]>, BackendError>("templates", GetTemplates)
  const [template, setTemplate] = useState<IMessageTemplate>()
  const [templates, setTemplates] = useState<IMessageTemplate[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => templates, [templates])
  const [preFilteredData, setPreFilteredData] = useState<IMessageTemplate[]>([])
  const [selectedTemplates, setSelectedTemplates] = useState<IMessageTemplate[]>([])
  const [filter, setFilter] = useState<string | undefined>()

  const [selectedData, setSelectedData] = useState<SelectedData[]>([])
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [reactPaginationData, setReactPaginationData] = useState({ limit: 10, page: 1, total: 1 });
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + reactPaginationData.limit;
  const currentItems = MemoData.slice(itemOffset, endOffset)
  
  function handleExcel() {
    setAnchorEl(null)
    try {
      if (selectedData.length === 0)
        return alert("please select some rows")
      ExportToExcel(selectedData, "template_data")
      setSent(true)
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }

  }

  // refine data
  useEffect(() => {
    let data: SelectedData[] = []
    selectedTemplates.map((template) => {
      return data.push({
        name: template.name,
        message: template.message,
        caption: template.caption,
        media: template.media?.public_url
      })
    })
    setSelectedData(data)
  }, [selectedTemplates])

  useEffect(() => {
    setTemplate(template)
  }, [template])

  useEffect(() => {
    if (isSuccess) {
      setTemplates(data.data)
      setPreFilteredData(data.data)
      setReactPaginationData({
        ...reactPaginationData,
        total: Math.ceil(data.data.length / reactPaginationData.limit)
      })
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
  useEffect(() => {
    setItemOffset(reactPaginationData.page * reactPaginationData.limit % reactPaginationData.total)
  }, [reactPaginationData])
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

            {sent && <AlertBar message="File Exported Successfuly" color="success" />}


            <IconButton size="medium"
              onClick={(e) => setAnchorEl(e.currentTarget)
              }
              sx={{ border: 1, borderRadius: 2, marginLeft: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)
              }
              TransitionComponent={Fade}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem onClick={() => {
                setChoice({ type: TemplateChoiceActions.create_template })
                setAnchorEl(null)
              }}
              >New Template</MenuItem>
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu>
            <NewTemplateDialog />
          </>

        </Stack>
      </Stack>
      {/*  table */}
      <TemplatesTable
        template={template}
        selectAll={selectAll}
        selectedTemplates={selectedTemplates}
        setSelectedTemplates={setSelectedTemplates}
        setSelectAll={setSelectAll}
        templates={currentItems}
        setTemplate={setTemplate}
      />
      <ReactPagination reactPaginationData={reactPaginationData} setReactPaginationData={setReactPaginationData} data={MemoData}
      />
    </>

  )

}

