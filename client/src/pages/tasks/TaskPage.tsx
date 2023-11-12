import { Search } from '@mui/icons-material'
import { Fade, IconButton, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchTasks, GetTasks } from '../../services/TaskServices'
import DBPagination from '../../components/pagination/DBpagination';
import TasksTable from '../../components/tables/TasksTable';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, TaskChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { ITask } from '../../types/task.types'




export default function TasksPage() {
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filter, setFilter] = useState<string | undefined>()
    const [task, setTask] = useState<ITask>()
    const [tasks, setTasks] = useState<ITask[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => tasks, [tasks])
    const [preFilteredData, setPreFilteredData] = useState<ITask[]>([])
    const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filterCount, setFilterCount] = useState(0)
    const [selectedTasks, setSelectedTasks] = useState<ITask[]>([])

    const { data, isLoading } = useQuery<AxiosResponse<{ tasks: ITask[], page: number, total: number, limit: number }>, BackendError>(["tasks", paginationData], async () => GetTasks({ limit: paginationData?.limit, page: paginationData?.page }))

    const { data: fuzzytasks, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ tasks: ITask[], page: number, total: number, limit: number }>, BackendError>(["fuzzytasks", filter], async () => FuzzySearchTasks({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
        enabled: false
    })
    const [selectedData, setSelectedData] = useState<{
        task_description: string,
        person: string,
        created_at: string,
        updated_at: string,
        created_by: string,
        updated_by: string,
    }[]>()
    const [sent, setSent] = useState(false)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    function handleExcel() {
        setAnchorEl(null)
        try {
            selectedData && ExportToExcel(selectedData, "tasks_data")
            setSent(true)
            setSelectAll(false)
            setSelectedData([])
            setSelectedTasks([])
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }

    // refine data
    useEffect(() => {
        let data: {
            task_description: string,
            person: string,
            created_at: string,
            updated_at: string,
            updated_by: string,
            created_by: string,
        }[] = []
        selectedTasks.map((task) => {
            return data.push(
                {
                    task_description: task.task_description,
                    person: task.person.username,
                    created_at: task.created_at.toLocaleString(),
                    created_by: task.created_by.username,
                    updated_by: task.updated_by.username,
                    updated_at: task.updated_at.toLocaleString(),
                })
        })
        if (data.length > 0)
            setSelectedData(data)
    }, [selectedTasks])

    useEffect(() => {
        if (!filter) {
            setTasks(preFilteredData)
            setPaginationData(preFilteredPaginationData)
        }
    }, [filter])

    useEffect(() => {
        if (filter) {
            refetchFuzzy()
        }
    }, [paginationData])

    useEffect(() => {
        if (data && !filter) {
            setTasks(data.data.tasks)
            setPreFilteredData(data.data.tasks)
            setPreFilteredPaginationData({
                ...paginationData,
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total
            })
            setPaginationData({
                ...paginationData,
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total
            })
        }
    }, [data])

    useEffect(() => {
        if (fuzzytasks && filter) {
            setTasks(fuzzytasks.data.tasks)
            let count = filterCount
            if (count === 0)
                setPaginationData({
                    ...paginationData,
                    page: fuzzytasks.data.page,
                    limit: fuzzytasks.data.limit,
                    total: fuzzytasks.data.total
                })
            count = filterCount + 1
            setFilterCount(count)
        }
    }, [fuzzytasks])

    return (
        <>

            {
                isLoading && <LinearProgress />
            }
            {
                isFuzzyLoading && <LinearProgress />
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
                    Tasks
                </Typography>

                <Stack
                    direction="row"
                >
                    {/* search bar */}
                    < Stack direction="row" spacing={2}>
                        <TextField
                            fullWidth
                            size="small"
                            onChange={(e) => {
                                setFilter(e.currentTarget.value)
                                setFilterCount(0)
                            }}
                            autoFocus
                            placeholder={`${MemoData?.length} records...`}
                            style={{
                                fontSize: '1.1rem',
                                border: '0',
                            }}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    refetchFuzzy()
                                }
                            }}
                        />
                        <IconButton
                            sx={{ bgcolor: 'whitesmoke' }}
                            onClick={() => {
                                refetchFuzzy()
                            }}
                        >
                            <Search />
                        </IconButton>
                    </Stack >
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
                            <MenuItem
                                onClick={() => {
                                    setChoice({ type: TaskChoiceActions.create_task })
                                    setAnchorEl(null)
                                }}
                            > Add New</MenuItem>
                            < MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>

                        </Menu >
                    </>
                </Stack >
            </Stack >
            {/* table */}
            < TasksTable
                task={task}
                setTask={setTask}
                selectAll={selectAll}
                selectedTasks={selectedTasks}
                setSelectedTasks={setSelectedTasks}
                setSelectAll={setSelectAll}
                tasks={MemoData}
            />
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}

