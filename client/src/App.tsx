import { useContext } from "react";
import AppRoutes from "./Routes";
import { LoadingContext } from "./contexts/loaderContext";
import { LinearProgress } from "@mui/material";

function App() {
  const { loading } = useContext(LoadingContext)
  return (
    <>
      {!loading && < AppRoutes />}
      {loading && <LinearProgress />}

    </>
  )
}


export default App
