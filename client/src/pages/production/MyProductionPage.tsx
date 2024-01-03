import { Stack } from "@mui/material"
import NewProductionForm from "../../components/forms/production/CreateProductionForm"

function MyProductionPage() {
  return (
    <Stack p={2}>
      <h2>My Production</h2>
      <NewProductionForm />
    </Stack>

  )
}

export default MyProductionPage