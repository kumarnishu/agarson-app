import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { IContact } from '../../types'
import { BackendError } from '../..'
import { headColor } from '../../utils/colors'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext, ContactChoiceActions } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import ReactPagination from '../../components/pagination/ReactPagination'
import { GetContacts } from '../../services/ContactServices'
import NewContactDialog from '../../components/dialogs/contacts/NewContactDialog'
import ContactsTable from '../../components/tables/ContactTable'
import UploadContactsFromExcelButton from '../../components/buttons/UploadContactsFromExcelButton'
import { UserContext } from '../../contexts/userContext'


type SelectedData = {
  name?: string,
  customer_name?: string,
  mobile?: string,
  city?: string,
  state?: string,
  created_at?: string,
  updated_at?: string
}

export default function ContactPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IContact[]>, BackendError>("contacts", GetContacts)
  const [contact, setContact] = useState<IContact>()
  const [contacts, setContacts] = useState<IContact[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => contacts, [contacts])
  const [preFilteredData, setPreFilteredData] = useState<IContact[]>([])
  const [selectedContacts, setSelectedContacts] = useState<IContact[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>([])
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [reactPaginationData, setReactPaginationData] = useState({ limit: 10, page: 1, total: 1 });
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + reactPaginationData.limit;
  const currentItems = MemoData.slice(itemOffset, endOffset)
  const { user: LoggedInUser } = useContext(UserContext)


  function handleExcel() {
    setAnchorEl(null)
    try {
      if (selectedData.length === 0)
        return alert("please select some rows")
      ExportToExcel(selectedData, "contacts_data")
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
    selectedContacts.map((contact) => {
      return data.push({
        name: contact.name,
        mobile: contact.mobile,
        created_at: new Date(contact.created_at).toLocaleDateString(),
        updated_at: new Date(contact.updated_at).toLocaleDateString()
      })
    })
    setSelectedData(data)
  }, [selectedContacts])

  useEffect(() => {
    if (isSuccess) {
      setContacts(data.data)
      setPreFilteredData(data.data)
      setReactPaginationData({
        ...reactPaginationData,
        total: Math.ceil(data.data.length / reactPaginationData.limit)
      })
    }
  }, [isSuccess, contacts, data])

  useEffect(() => {
    setItemOffset(reactPaginationData.page * reactPaginationData.limit % reactPaginationData.total)
  }, [reactPaginationData])

  useEffect(() => {
    if (filter) {
      if (contacts) {
        const searcher = new FuzzySearch(contacts, ["name", "mobile", "created_by", "updated_by"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setContacts(result)
      }
    }
    if (!filter)
      setContacts(preFilteredData)

  }, [filter, contacts])

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
          Contacts
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2} sx={{ bgcolor: headColor }
          }>
            {LoggedInUser?.is_admin ?
              < UploadContactsFromExcelButton /> : null}
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
                setChoice({ type: ContactChoiceActions.create_contact })
                setAnchorEl(null)
              }}
              >New Contact</MenuItem>
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>


            </Menu>
            <NewContactDialog />
          </>

        </Stack>
      </Stack>
      {/*  table */}
      <ContactsTable
        contact={contact}
        selectAll={selectAll}
        selectedContacts={selectedContacts}
        setSelectedContacts={setSelectedContacts}
        setSelectAll={setSelectAll}
        contacts={currentItems}
        setContact={setContact}
      />
      <ReactPagination reactPaginationData={reactPaginationData} setReactPaginationData={setReactPaginationData} data={MemoData}
      />
    </>

  )

}

