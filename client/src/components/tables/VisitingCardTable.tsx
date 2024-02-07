import { Box, Checkbox, IconButton } from '@mui/material'
import { Stack } from '@mui/system'
import {  useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
// import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import moment from 'moment'
import ViewTextDialog from '../dialogs/text/ViewTextDialog'
import { IVisitingCard } from '../../types/visiting_card.types'
import { Photo } from '@mui/icons-material'
// import { ChoiceContext } from '../../contexts/dialogContext'


type Props = {
    card: IVisitingCard | undefined
    setVisitingCard: React.Dispatch<React.SetStateAction<IVisitingCard | undefined>>,
    cards: IVisitingCard[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedVisitingCards: IVisitingCard[]
    setSelectedVisitingCards: React.Dispatch<React.SetStateAction<IVisitingCard[]>>,
    setSorted: React.Dispatch<React.SetStateAction<boolean>>
    sorted: boolean
}

function VisitingCardTable({ card, cards, setVisitingCard, selectAll,  setSelectAll, selectedVisitingCards, setSelectedVisitingCards }: Props) {
    const [data, setData] = useState<IVisitingCard[]>(cards)
    // const { setChoice } = useContext(ChoiceContext)
    const [text, setText] = useState<string>()
    // const { user } = useContext(UserContext)

    useEffect(() => {
        setData(cards)
    }, [cards])
    
    return (
        <>
            <Box sx={{
                overflow: "auto",
                height: '70vh'
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
                                            setSelectedVisitingCards(cards)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedVisitingCards([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Date

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Status

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Name

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                City

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                State

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Salesman

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Visiting Card

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Last Comment
                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Created at

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated at

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated By

                            </STableHeadCell>

                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((card, index) => {
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
                                            null}
                                        {!selectAll ?

                                            <STableCell>

                                                <Checkbox size="small"
                                                    onChange={(e) => {
                                                        setVisitingCard(card)
                                                        if (e.target.checked) {
                                                            setSelectedVisitingCards([...selectedVisitingCards, card])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedVisitingCards((cards) => cards.filter((item) => {
                                                                return item._id !== card._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null}
                                        <STableCell style={{ backgroundColor: Boolean(!card.is_closed) ? 'rgba(255,0,0,0.1)' : 'rgba(52, 200, 84, 0.6)' }}>
                                            <PopUp
                                                element={
                                                    <Stack
                                                        direction="row" spacing={1}>
                                                        {

                                                        }

                                                    </Stack>
                                                }
                                            />
                                        </STableCell>

                                     
                                        <STableCell>
                                            {index + 1}
                                        </STableCell>
                                        <STableCell>

                                            {card.card && <IconButton
                                                onClick={() => {
                                                    setVisitingCard(card)
                                                }}

                                            ><Photo />
                                            </IconButton>}

                                        </STableCell>
                                        <STableCell>
                                            {moment(new Date(card.created_at)).format('DD/MM/YYYY')}
                                        </STableCell>

                                        <STableCell title={card.name} onClick={() => {
                                            if (card.name) {
                                                setText(card.name)
                                            }
                                        }}>
                                            {card.name && card.name.slice(0, 50) + "..."}
                                        </STableCell>
                                        <STableCell>
                                            {card.is_closed ? "Closed " : "Open"}
                                        </STableCell>
                                        <STableCell>
                                            {card.city ? card.city : ""}
                                        </STableCell>
                                        <STableCell>
                                            {card.state ? card.state : ""}
                                        </STableCell>
                                        <STableCell>
                                            {card.salesman && card.salesman.username}
                                        </STableCell>
                                        <STableCell>
                                            {new Date(card.created_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {new Date(card.updated_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {card.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {card.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {
                card ?
                    <>

                    </>
                    : null
            }
            {text && <ViewTextDialog wrap={true} text={text} setText={setText} />}
        </>
    )
}

export default VisitingCardTable