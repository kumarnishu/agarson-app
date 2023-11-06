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

// import { FixedSizeList as List } from 'react-window';

// const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => (
//   <div style={style}>Row {index}</div>
// );

// const Example = () => (
//   <List
//     height={150}
//     itemCount={1000}
//     itemSize={35}
//     width={300}
//   >
//     {Row}
//   </List>
// );