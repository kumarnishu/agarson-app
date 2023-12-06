import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { IChat } from '../../types/chat.types'


type Props = {
    chats: IChat[]
}

function ChatsTable({ chats }: Props) {
    const [data, setData] = useState<IChat[]>(chats)

    useEffect(() => {
        setData(chats)
    }, [chats])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                height: '73.5vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>



                         
                            <STableHeadCell
                            >

                                Id

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Name

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Author

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Author Name

                            </STableHeadCell>
                           
                            <STableHeadCell
                            >

                                Chat

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Has Media

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Timestamp

                            </STableHeadCell>
                            {/* visitin card */}
                        </STableRow>
                    </STableHead>

                    <STableBody >
                        {

                            data && data.map((chat, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <STableRow
                                        >

                                          
                                            <STableCell style={{ backgroundColor: chat.isGroup ? "rgba(0,255,0,0.1)" : "whitesmoke" }}>
                                                {chat && chat.from || ""}
                                            </STableCell>
                                            <STableCell >
                                                <Typography style={{ whiteSpace: 'pre-wrap' }} title={chat && chat.name}>
                                                    {chat && chat.name && chat.name.slice(0, 30)}
                                                </Typography>
                                            </STableCell>
                                            <STableCell>
                                                {chat && chat.author || ""}
                                            </STableCell>
                                            <STableCell >
                                                <Typography style={{ whiteSpace: 'pre-wrap' }} title={chat && chat.authorName}>
                                                    {chat && chat.authorName && chat.authorName.slice(0, 30)}
                                                </Typography>
                                            </STableCell>
                                           
                                            <STableCell>
                                                <Typography style={{ whiteSpace: 'pre-wrap' }} title={chat && chat.body}>
                                                    {chat && chat.body && chat.body.slice(0, 50)}
                                                </Typography>
                                            </STableCell>
                                         
                                            <STableCell>
                                                {chat && chat.hasMedia ? "Yes" : ""}
                                            </STableCell>
                                            <STableCell>
                                                {chat && chat.timestamp && new Date(chat.timestamp).toLocaleString()}
                                            </STableCell>
                                         
                                        </STableRow>

                                    </React.Fragment>

                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >

        </>

    )
}

export default ChatsTable