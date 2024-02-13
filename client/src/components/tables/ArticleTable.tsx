import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, ProductionChoiceActions } from '../../contexts/dialogContext'
import PopUp from '../popup/PopUp'
import { Edit, RestartAlt } from '@mui/icons-material'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { IArticle } from '../../types/production.types'
import UpdateArticleDialog from '../dialogs/production/UpdateArticleDialog'
import ToogleArticleDialog from '../dialogs/production/ToogleArticleDialog'


type Props = {
    article: IArticle | undefined,
    setArticle: React.Dispatch<React.SetStateAction<IArticle | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    articles: IArticle[],
    selectedArticles: IArticle[]
    setSelectedArticles: React.Dispatch<React.SetStateAction<IArticle[]>>,
}
function ArticlesTable({ article, selectAll, articles, setSelectAll, setArticle, selectedArticles, setSelectedArticles }: Props) {
    const [data, setData] = useState<IArticle[]>(articles)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(articles)
    }, [articles, data])
    return (
        <>
            <Box sx={{
                overflow: "auto",
                height: '80vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >


                                <Checkbox
                                    indeterminate={selectAll ? true : false}
                                    checked={Boolean(selectAll)}
                                    size="small" onChange={(e) => {
                                        if (e.currentTarget.checked) {
                                            setSelectedArticles(articles)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedArticles([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>
                            {user?.productions_access_fields.is_editable &&
                                <STableHeadCell
                                >

                                    Actions

                                </STableHeadCell>}
                            <STableHeadCell
                            >

                                Name

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Display name

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Status

                            </STableHeadCell>
                           

                            <STableHeadCell
                            >

                                Created At

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated At

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated By

                            </STableHeadCell>


                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            articles && articles.map((article, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        {selectAll ?
                                            <STableCell>


                                                <Checkbox size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell>

                                                <Checkbox size="small"
                                                    onChange={(e) => {
                                                        setArticle(article)
                                                        if (e.target.checked) {
                                                            setSelectedArticles([...selectedArticles, article])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedArticles((articles) => articles.filter((item) => {
                                                                return item._id !== article._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                        {user?.productions_access_fields.is_editable &&
                                            <STableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row">
                                                            <>
                                                                <Tooltip title="edit">
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            setArticle(article)
                                                                            setChoice({ type: ProductionChoiceActions.update_article })
                                                                        }}

                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                {user?.productions_access_fields.is_editable &&
                                                                    <Tooltip title="Toogle">
                                                                        <IconButton color="primary"
                                                                            onClick={() => {
                                                                                setArticle(article)
                                                                                setChoice({ type: ProductionChoiceActions.toogle_article })

                                                                            }}
                                                                        >
                                                                            <RestartAlt />
                                                                        </IconButton>
                                                                    </Tooltip>}
                                                            </>

                                                        </Stack>}
                                                />

                                            </STableCell>}
                                        <STableCell>
                                            {article.name}
                                        </STableCell>
                                        <STableCell>
                                            {article.display_name}
                                        </STableCell>
                                        <STableCell>
                                            {article.active ? "active" : "inactive"}
                                        </STableCell>
                                      
                                        <STableCell>
                                            {article.created_at && new Date(article.created_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {article.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {article.updated_at && new Date(article.updated_at).toLocaleString()}
                                        </STableCell>

                                        <STableCell>
                                            {article.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                {
                    article ?
                        <>
                            <UpdateArticleDialog article={article} />
                            <ToogleArticleDialog article={article} />
                        </> : null
                }
            </Box>
        </>
    )
}

export default ArticlesTable