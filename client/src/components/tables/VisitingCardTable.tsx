import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import moment from 'moment'
import ViewTextDialog from '../dialogs/text/ViewTextDialog'
import { IVisitingCard } from '../../types/visiting_card.types'
import { Comment, Delete, Edit, Flip, Photo, Share, Visibility } from '@mui/icons-material'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import UpdateVisitingCardDialog from '../dialogs/cards/UpdateVisitingCardDialog'
import ReferVisitingCardDialog from '../dialogs/cards/ReferVisitingCardDialog'
import AddCommentVisitingCardDialog from '../dialogs/cards/AddCommentVisitingCardDialog'
import ViewCardCommentsDialog from '../dialogs/cards/ViewCardCommentsDialog'
import ToogleStatusCardDialog from '../dialogs/cards/ToogleStatusCardDialog'
import { UserContext } from '../../contexts/userContext'


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

function VisitingCardTable({ card, cards, setVisitingCard, selectAll, setSelectAll, selectedVisitingCards, setSelectedVisitingCards }: Props) {
    const [data, setData] = useState<IVisitingCard[]>(cards)
    const { setChoice } = useContext(ChoiceContext)
    const [text, setText] = useState<string>()
    const { user } = useContext(UserContext)

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

                                No

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

                                Card

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

                                Refer

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Last Comment
                            </STableHeadCell>



                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>

                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((card, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedVisitingCards.length > 0 && selectedVisitingCards.find((t) => t._id === card._id) ? "lightgrey" : "white" }}
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
                                                        {user?.crm_access_fields.is_editable && <>
                                                            <Tooltip title="edit">
                                                                <IconButton color="info"
                                                                    onClick={() => {
                                                                        setChoice({ type: LeadChoiceActions.update_card })
                                                                        setVisitingCard(card)

                                                                    }}
                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="toogle">
                                                                <IconButton color="info"
                                                                    onClick={() => {
                                                                        setChoice({ type: LeadChoiceActions.toogle_card })
                                                                        setVisitingCard(card)

                                                                    }}
                                                                >
                                                                    <Flip />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>}
                                                        {user?.crm_access_fields.is_deletion_allowed &&
                                                            <Tooltip title="delete">
                                                                <IconButton color="error"
                                                                    onClick={() => {
                                                                        setChoice({ type: LeadChoiceActions.delete_lead })
                                                                        setVisitingCard(card)

                                                                    }}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                        <Tooltip title="refer">
                                                            <IconButton color="primary"
                                                                onClick={() => {

                                                                    setChoice({ type: LeadChoiceActions.refer_card })
                                                                    setVisitingCard(card)

                                                                }}
                                                            >
                                                                <Share />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="view comments">
                                                            <IconButton color="primary"
                                                                onClick={() => {

                                                                    setChoice({ type: LeadChoiceActions.view_card_comments })
                                                                    setVisitingCard(card)


                                                                }}
                                                            >
                                                                <Visibility />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Add Comment">
                                                            <IconButton
                                                                onClick={() => {

                                                                    setChoice({ type: LeadChoiceActions.add_card_comment })
                                                                    setVisitingCard(card)

                                                                }}
                                                            >
                                                                <Comment />
                                                            </IconButton>
                                                        </Tooltip>


                                                    </Stack>
                                                }
                                            />
                                        </STableCell>
                                        <STableCell>
                                            {index + 1}
                                        </STableCell>
                                        <STableCell>
                                            {moment(new Date(card.created_at)).format("DD/MM/YYYY")}
                                        </STableCell>
                                        <STableCell>
                                            {card.is_closed ? "Closed " : "Open"}
                                        </STableCell>

                                        <STableCell>

                                            {card.card && <IconButton
                                                onClick={() => {
                                                    setVisitingCard(card)
                                                }}

                                            ><Photo />
                                            </IconButton>}

                                        </STableCell>
                                        <STableCell title={card.name} onClick={() => {
                                            if (card.name) {
                                                setText(card.name)
                                            }
                                        }}>
                                            {card.name && card.name}
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
                                            {card.refer && card.refer.name}
                                        </STableCell>
                                        <STableCell>
                                            {card.comments && card.comments.length > 0 && card.comments[card.comments.length - 1].comment || ""}

                                        </STableCell>

                                        <STableCell>
                                            {card.created_by.username}
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
                        <UpdateVisitingCardDialog card={card} />
                        <ReferVisitingCardDialog card={card} />
                        <AddCommentVisitingCardDialog card={card} />
                        <ViewCardCommentsDialog card={card} />
                        <ToogleStatusCardDialog card={card} />
                    </>
                    : null
            }
            {text && <ViewTextDialog wrap={true} text={text} setText={setText} />}
        </>
    )
}

export default VisitingCardTable