import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext, ContactChoiceActions } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import { GetContacts } from '../../services/ContactServices'
import NewContactDialog from '../../components/dialogs/contacts/NewContactDialog'
import ContactsTable from '../../components/tables/ContactTable'
import UploadContactsFromExcelButton from '../../components/buttons/UploadContactsFromExcelButton'
import { UserContext } from '../../contexts/userContext'
import { IContact } from '../../types/contact.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'


type SelectedData = {
  name?: string,
  mobile?: string,
  party?: string,
  created_at?: string,
  updated_at?: string
}
let template: SelectedData[] = [
  {
    name: "nishu",
    mobile: "6787876765",
    party: "demo party"
  }
]

export default function ContactPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IContact[]>, BackendError>("contacts", GetContacts)
  const [contact, setContact] = useState<IContact>()
  const [contacts, setContacts] = useState<IContact[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => contacts, [contacts])
  const [preFilteredData, setPreFilteredData] = useState<IContact[]>([])
  const [selectedContacts, setSelectedContacts] = useState<IContact[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)


  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "contacts_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedContacts([])
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
        party: contact.party,
        created_at: new Date(contact.created_at).toLocaleDateString(),
        updated_at: new Date(contact.updated_at).toLocaleDateString()
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedContacts])

  useEffect(() => {
    if (isSuccess) {
      setContacts(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, contacts, data])


  useEffect(() => {
    if (filter) {
      if (contacts) {
        const searcher = new FuzzySearch(contacts, ["name", "mobile", "party", "created_by", "updated_by"], {
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
          < Stack direction="row" spacing={2} >
            {!LoggedInUser?.contacts_access_fields.is_hidden ?
              < UploadContactsFromExcelButton disabled={Boolean(!LoggedInUser?.contacts_access_fields.is_editable)} /> : null}
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
            >{LoggedInUser?.contacts_access_fields.is_editable &&
              <MenuItem onClick={() => {
                setChoice({ type: ContactChoiceActions.create_contact })
                setAnchorEl(null)
              }}
              >New Contact</MenuItem>}
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>


            </Menu>
            <NewContactDialog />
          </>

        </Stack>
      </Stack>
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading &&
        <ContactsTable
          contact={contact}
          selectAll={selectAll}
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
          setSelectAll={setSelectAll}
          contacts={MemoData}
          setContact={setContact}
        />}

    </>

  )

}

