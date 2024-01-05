import { Button, LinearProgress, Paper, Stack, Typography } from "@mui/material"
import { useContext } from "react"
import { ChoiceContext, ProductionChoiceActions } from "../../contexts/dialogContext"
import { BackendError } from "../.."
import { AxiosResponse } from "axios"
import { useQuery } from "react-query"
import moment from "moment"
import { GetMyShoeWeights } from "../../services/ProductionServices"
import { IShoeWeight } from "../../types/production.types"
import NewShoeWeightDialog from "../../components/dialogs/production/CreateShoeWeightDialog"



function MyShoeWeightPage() {
  const { setChoice } = useContext(ChoiceContext)
  const { data, isLoading } = useQuery<AxiosResponse<IShoeWeight[]>, BackendError>("shoe_weights", GetMyShoeWeights)
  return (
    <>
      {isLoading && <LinearProgress />}
      <Stack sx={{ justifyContent: 'center' }}>
        < Button disabled={isLoading || data && data?.data.length === 3} size="large" sx={{ mx: 8, my: 2, fontWeight: 'bold', fontSize: 14 }} color="info"
          onClick={() => { setChoice({ type: ProductionChoiceActions.create_shoe_weight }) }}
        >+ Add Shoe Weight</Button>
      </Stack >
      <Stack sx={{ p: 1 }}>
        {data && data.data.map((weight, index) => {
          return (
            <Paper elevation={8} sx={{ p: 2, wordSpacing: 2, m: 2, boxShadow: 3, backgroundColor: 'white', borderRadius: 2 }}>
              <Stack key={index}
                direction="column"
                gap={2}
              >
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Dye/Size : {weight.dye.dye_number}/{weight.dye.size}
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Machine : {weight.machine.name}
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Article : {weight.article.name}
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  St.Weight : {weight.article.sizes.find((size) => size.size === weight.dye.size)?.standard_weight}
                </Typography>

                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Weight : 
                  {/* @ts-ignore */}
                  <span style={{ fontWeight: 'bold', fontSize: 16, color: weight.article.sizes.find((size) => size.size === weight.dye.size)?.standard_weight  < weight.shoe_weight ? "red" : "green" }}> {weight.shoe_weight}</span>
                </Typography>

                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  Datetime : {moment(new Date(weight.created_at)).format('MMMM Do YYYY, h:mm:ss a')}
                </Typography>
              </Stack>
            </Paper>
          )
        })}
      </Stack>
      <NewShoeWeightDialog />
    </>

  )
}

export default MyShoeWeightPage