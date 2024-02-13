import { Search } from '@mui/icons-material'
import { Fade, FormControlLabel, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, Switch, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext, ProductionChoiceActions } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import ArticlesTable from '../../components/tables/ArticleTable'
import { UserContext } from '../../contexts/userContext'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import NewArticleDialog from '../../components/dialogs/production/CreateArticleDialog'
import { IArticle } from '../../types/production.types'
import { GetArticles } from '../../services/ProductionServices'
import UploadArticlesFromExcelButton from '../../components/buttons/UploadArticlesButton'


type SelectedData = {
  name?: string,
  display_name?: string,
  is_active: boolean
  created_at?: string,
  updated_at?: string
}
let template: SelectedData[] = [
  {
    name: "power",
    is_active: true,
    display_name: "power"
  }
]

export default function ArticlePage() {
  const [hidden, setHidden] = useState(false)
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IArticle[]>, BackendError>(["articles", hidden], async () => GetArticles(String(hidden)))
  const [article, setArticle] = useState<IArticle>()
  const [articles, setArticles] = useState<IArticle[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => articles, [articles])
  const [preFilteredData, setPreFilteredData] = useState<IArticle[]>([])
  const [selectedArticles, setSelectedArticles] = useState<IArticle[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)


  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "articles_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedArticles([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: SelectedData[] = []
    selectedArticles.map((article) => {
      return data.push({
        name: article.name,
        display_name: article.display_name,
        is_active: article.active ? true : false,
        created_at: new Date(article.created_at).toLocaleDateString(),
        updated_at: new Date(article.updated_at).toLocaleDateString()
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedArticles])

  useEffect(() => {
    if (isSuccess) {
      setArticles(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, articles, data])


  useEffect(() => {
    if (filter) {
      if (articles) {
        const searcher = new FuzzySearch(articles, ["name", "display_name", "created_by", "updated_by"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setArticles(result)
      }
    }
    if (!filter)
      setArticles(preFilteredData)

  }, [filter, articles])
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
          Articles
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2} >
            {LoggedInUser?.productions_access_fields.is_editable ?
              < UploadArticlesFromExcelButton disabled={Boolean(!LoggedInUser?.productions_access_fields.is_editable)} /> : null}
            <FormControlLabel control={<Switch
              defaultChecked={Boolean(hidden)}
              onChange={() => setHidden(!hidden)}
            />} label="Show hidden" />

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


            <IconButton size="small" color="primary"
              onClick={(e) => setAnchorEl(e.currentTarget)
              }
              sx={{ border: 2, borderRadius: 3, marginLeft: 1 }}
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
            >{LoggedInUser?.productions_access_fields.is_editable &&
              <MenuItem onClick={() => {
                setChoice({ type: ProductionChoiceActions.create_article })
                setAnchorEl(null)
              }}
              >New Article</MenuItem>}
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>


            </Menu>
            <NewArticleDialog />
          </>

        </Stack>
      </Stack>
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading &&
        <ArticlesTable
          article={article}
          selectAll={selectAll}
          selectedArticles={selectedArticles}
          setSelectedArticles={setSelectedArticles}
          setSelectAll={setSelectAll}
          articles={MemoData}
          setArticle={setArticle}
        />}

    </>

  )

}

