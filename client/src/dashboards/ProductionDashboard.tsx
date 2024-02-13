import { Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppsIcon from '@mui/icons-material/Apps';
import { UserContext } from "../contexts/userContext";

function ProductionDashboard() {
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])
  const { user } = useContext(UserContext)

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    tmpfeatures.push({ feature: 'my production ', is_visible: true, url: paths.production })
   
    
    if (user?.productions_access_fields.is_editable) {
      tmpfeatures.push({ feature: 'production ', is_visible: true, url: paths.production_admin })
     
      tmpfeatures.push({ feature: 'articles', is_visible: true, url: paths.articles })
      tmpfeatures.push({ feature: 'machines ', is_visible: true, url: paths.machines })
      tmpfeatures.push({ feature: 'dyes ', is_visible: true, url: paths.dyes })
      tmpfeatures.push({ feature: 'machine categories ', is_visible: true, url: paths.machine_categories })
    }
    setFeatures(tmpfeatures)
  }, [])

  return (
    <>
      <Grid container sx={{ pt: 2 }} >
        {features.map((feat, index) => {
          return (
            <Grid key={index} item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={feat.url} style={{ textDecoration: 'none' }}>
                <Paper sx={{ p: 2, bgcolor: 'white', boxShadow: 2, border: 10, borderRadius: 1, borderColor: 'white' }}>
                  <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                    <AppsIcon fontSize={'large'} />
                    <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                      {feat.feature}
                    </Typography>
                  </Stack>
                </Paper>
              </Link>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}


export default ProductionDashboard