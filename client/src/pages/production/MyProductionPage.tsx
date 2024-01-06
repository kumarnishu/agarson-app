import { Button, LinearProgress, Paper, Stack, TextField, Typography } from "@mui/material"
import NewProductionDialog from "../../components/dialogs/production/CreateProductionDialog"
import { useContext, useState } from "react"
import { ChoiceContext, ProductionChoiceActions } from "../../contexts/dialogContext"
import { BackendError } from "../.."
import { IMachine, IProduction } from "../../types/production.types"
import { AxiosResponse } from "axios"
import { useQuery } from "react-query"
import { GetMachines, GetMyProductions } from "../../services/ProductionServices"
import moment from "moment"

function MyProductionPage() {
  const [date, setDate] = useState<string>(moment(new Date().setDate(new Date().getDate() - 1)).format('YYYY-MM-DD'))
  const [machine, setArticle] = useState<string>()
  const { setChoice } = useContext(ChoiceContext)
  const { data: machines } = useQuery<AxiosResponse<IMachine[]>, BackendError>("machines", async () => GetMachines())
  const { data, isLoading } = useQuery<AxiosResponse<IProduction[]>, BackendError>(["productions", date, machine], async () => GetMyProductions({ date: date, machine: machine }))
  return (
    <>
      {isLoading && <LinearProgress />}
      <Stack direction={'column'} justifyContent={'center'}>
        <Typography variant="h6" sx={{ pt: 2, fontSize: '18', textAlign: 'center' }}>Daily Productions</Typography>

        <Stack gap={1} direction={'row'} p={2}>
          < TextField
            type="date"
            focused
            value={date}
            id="date"
            label="Production Date"
            fullWidth
            required
            onChange={(e) => setDate(e.target.value)}

          />
          < TextField
            select
            SelectProps={{
              native: true,
            }}
            value={machine}
            id="machines"
            required
            label="Select Machine"
            fullWidth
            onChange={(e) => setArticle(e.target.value)}
          >
            <option key={'00'} value={undefined}>
            </option>
            {
              machines && machines.data && machines.data.map((machine, index) => {
                return (<option key={index} value={machine._id}>
                  {machine.display_name}
                </option>)
              })
            }
          </TextField>
        </Stack>
        <Stack sx={{ justifyContent: 'center' }}>
          < Button variant="contained" disabled={isLoading} size="large" sx={{ mx: 8, my: 2, fontWeight: 'bold', fontSize: 14 }} color="info"
            onClick={() => { setChoice({ type: ProductionChoiceActions.create_production }) }}
          >+ Create Production</Button>
        </Stack >
        <Stack sx={{ p: 1 }}>
          {data && data.data.map((production, index) => {
            return (
              <Paper key={index} elevation={8} sx={{ p: 2, wordSpacing: 2, m: 2, boxShadow: 3, backgroundColor: 'white', borderRadius: 2 }}>
                <Stack
                  direction="column"
                  gap={2}
                >
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                    Machine : {production.machine.name}
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                    Articles : {production.machine.display_name}
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                    Thekedar :  {production.thekedar.username}
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                    Production : <span style={{ fontWeight: 'bold', color: 'green', fontSize: 14 }}> {production.production}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                    Production Hours : <span style={{ fontWeight: 'bold', color: 'green', fontSize: 14 }}> {production.production_hours}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                    Small Repair : <span style={{ fontWeight: 'bold', color: 'grey', fontSize: 14 }}> {production.small_repair}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                    Big Repair : <span style={{ fontWeight: 'bold', color: 'red', fontSize: 14 }}> {production.big_repair}</span>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', fontSize: 14 }}>
                    Created By : {production.created_by.username}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', color: 'grey', }}>
                    <b>Timestamp : {moment(new Date(production.created_at)).format('LT')}</b>
                  </Typography>

                </Stack>
              </Paper>
            )
          })}
        </Stack >
      </Stack>
      <NewProductionDialog />
    </>

  )
}

export default MyProductionPage