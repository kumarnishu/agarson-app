import { Button, Typography } from "@mui/material"
import { useState } from "react"
import VisitInPage from "./VisitInPage"
import EndDayPage from "./EndDayPage"

function MyVisitPage() {
  const [startDayLocation, setStartDayLocation] = useState<{ latitute: string, longitute: string, timestamp: Date }>()

  return (
    <>
      {!startDayLocation && < Typography variant="caption" color={'red'}> Please Enable Gps before moveing forward</Typography >}
      {!startDayLocation &&
        <Button size="large" variant="contained" fullWidth onClick={
          () => {
            navigator.geolocation.getCurrentPosition((data) => {
              setStartDayLocation({ latitute: String(data.coords.latitude), longitute: String(data.coords.longitude), timestamp: new Date(data.timestamp) })
            })
          }
        }>Start My Day</Button>}
      {startDayLocation && <VisitInPage />}
      {startDayLocation && <EndDayPage />}
    </>
  )
}

export default MyVisitPage