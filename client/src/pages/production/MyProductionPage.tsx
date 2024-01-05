import { Button, LinearProgress, Paper, Stack, Typography } from "@mui/material"
import NewProductionDialog from "../../components/dialogs/production/CreateProductionDialog"
import { useContext } from "react"
import { ChoiceContext, ProductionChoiceActions } from "../../contexts/dialogContext"
import { BackendError } from "../.."
import { IProduction } from "../../types/production.types"
import { AxiosResponse } from "axios"
import { useQuery } from "react-query"
import { GetMyProductions } from "../../services/ProductionServices"
import moment from "moment"

function MyProductionPage() {
  const { setChoice } = useContext(ChoiceContext)
  const { data, isLoading } = useQuery<AxiosResponse<IProduction[]>, BackendError>("productions", GetMyProductions)
  return (
    <>
      {isLoading && <LinearProgress />}
      <Stack sx={{ justifyContent: 'center' }}>
        < Button disabled={isLoading || data && data?.data.length === 3} size="large" sx={{ mx: 8, my: 2, fontWeight: 'bold', fontSize: 14 }} color="info"
          onClick={() => { setChoice({ type: ProductionChoiceActions.create_production }) }}
        >+ Create Production</Button>
      </Stack >
      <Stack sx={{ p: 1 }}>
        {data && data.data.map((production, index) => {
          return (
            <Paper elevation={8} sx={{ p: 2, wordSpacing: 2, m: 2, boxShadow: 3, backgroundColor: 'white', borderRadius: 2 }}>
              <Stack key={index}
                direction="column"
                gap={2}
              >
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Machine : {production.machine.name}
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Article : {production.article.name}
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Thekedar :  <span style={{ fontWeight: 'bold', fontSize: 16, color: 'grey' }}> {production.thekedar.username}</span>
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Production : <span style={{ fontWeight: 'bold', fontSize: 16, color: 'green' }}> {production.production}</span>
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Small Repair : <span style={{ fontWeight: 'bold', fontSize: 14, color: 'grey' }}> {production.small_repair}</span>
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  Big Repair : <span style={{ fontWeight: 'bold', fontSize: 16, color: 'red' }}> {production.big_repair}</span>
                </Typography>
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  Datetime : {moment(new Date(production.created_at)).format('MMMM Do YYYY, h:mm:ss a')}
                </Typography>
              </Stack>
            </Paper>
          )
        })}
      </Stack >
      <NewProductionDialog />
    </>

  )
}

export default MyProductionPage