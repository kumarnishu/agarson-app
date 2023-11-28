import { useContext } from "react";
import AppRoutes from "./Routes";
import { LoadingContext } from "./contexts/loaderContext";
import { LinearProgress } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const { loading } = useContext(LoadingContext)
  if (!localStorage.getItem('multi_login_token'))
    localStorage.setItem('multi_login_token', uuidv4())
  return (
    <>
      {!loading && < AppRoutes />}
      {loading && <LinearProgress />}

    </>
  )
}


export default App
