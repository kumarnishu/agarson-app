import { Stack } from "@mui/material"
import CreateShoeWeightForm from "../../components/forms/production/CreateShoeWeightForm"

function ProductionPage() {
  return (
  <Stack p={2}>
      <h2>SHoe Weight</h2>
      <CreateShoeWeightForm />
  </Stack>

  )
}

export default ProductionPage