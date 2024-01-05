import { Button, LinearProgress, Paper, Stack, TextField, Typography } from "@mui/material"
import { useContext, useState } from "react"
import { ChoiceContext, ProductionChoiceActions } from "../../contexts/dialogContext"
import { BackendError } from "../.."
import { AxiosResponse } from "axios"
import { useQuery } from "react-query"
import moment from "moment"
import { GetDyes, GetMyShoeWeights } from "../../services/ProductionServices"
import { IDye, IShoeWeight } from "../../types/production.types"
import NewShoeWeightDialog from "../../components/dialogs/production/CreateShoeWeightDialog"


function MyShoeWeightPage() {
  const { data: dyes } = useQuery<AxiosResponse<IDye[]>, BackendError>("dyes", GetDyes)
  const { setChoice } = useContext(ChoiceContext)
  const [dye, setDye] = useState<string>()
  const { data, isLoading } = useQuery<AxiosResponse<IShoeWeight[]>, BackendError>(["shoe_weights", dye], async () => GetMyShoeWeights(dye))
  return (
    <>
      {isLoading && <LinearProgress />}
      <Stack direction={'column'} >
        <Typography variant="h6" sx={{ fontSize: '18', textAlign: 'center' }}>Daily Sole Weights</Typography>
        <Stack sx={{ justifyContent: 'center', px: 2 }}>
          < TextField
            size='small'
            select
            value={dye}
            SelectProps={{
              native: true,
            }}
            onChange={(e) => {
              setDye(e.target.value)
            }}
            required
            id="Dye"
            label="Choose Dye"
            fullWidth
          >
            <option key={'00'} value={undefined}>

            </option>
            {
              dyes && dyes.data.map((dye, index) => {
                return (<option key={index} value={dye._id}>
                  {dye.dye_number} : size-{dye.size}
                </option>)
              })
            }
          </TextField>

          <Button variant="outlined" disabled={isLoading} size="large" sx={{ mx: 8, my: 2, fontWeight: 'bold', fontSize: 14 }} color="info"
            onClick={() => { setChoice({ type: ProductionChoiceActions.create_shoe_weight }) }}
          >+ New Shoe Weight</Button>
        </Stack>
        <Stack sx={{ p: 1 }}>
          {data && data.data.map((weight, index) => {
            return (
              <Paper key={index} elevation={8} sx={{ p: 2, wordSpacing: 2, m: 2, boxShadow: 3, backgroundColor: 'white', borderRadius: 2 }}>
                <Stack
                  direction="column"
                  gap={2}
                >
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Dye/Size : {weight.dye.dye_number}/{weight.dye.size}
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Machine : {weight.machine.name}
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Article : {weight.article.name}
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    St.Weight : {weight.article.sizes.find((size) => size.size === weight.dye.size)?.standard_weight}
                  </Typography>

                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Weight :
                    {/* @ts-ignore */}
                    <span style={{ fontWeight: 'bold', fontSize: 16, color: weight.article.sizes.find((size) => size.size === weight.dye.size)?.standard_weight < weight.shoe_weight ? "red" : "green" }}> {weight.shoe_weight - weight.article.sizes.find((size) => size.size === weight.dye.size)?.upper_weight}</span>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Created By :<b>{weight.created_by.username}</b>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', color: 'grey', fontSize: 12 }}>
                    <b>{moment(new Date(weight.created_at)).calendar()}</b>
                  </Typography>

                </Stack>
              </Paper>
            )
          })}
        </Stack>
      </Stack>
      <NewShoeWeightDialog />
    </>

  )
}

export default MyShoeWeightPage