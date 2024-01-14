import { Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BlueAgarsonLogo } from "../components/logo/Agarson";

function GreetingsDashboard() {
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    tmpfeatures.push({ feature: 'greetings ', is_visible: true, url: paths.greetings })
    setFeatures(tmpfeatures)
  }, [])

  return (
    <>
      <Grid container sx={{ pt: 2 }} >
        {features.map((feat, index) => {
          return (
            <Grid key={index} item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={feat.url} style={{ textDecoration: 'none' }}>
                <Paper sx={{ p: 2, bgcolor: 'white', boxShadow: 2, border: 10, borderRadius: 3, borderColor: 'white' }}>
                  <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                    <BlueAgarsonLogo width={35} height={35} title='users' />
                    <Typography variant="body1" sx={{ fontSize: 16, textTransform: 'capitalize' }} component="div">
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


export default GreetingsDashboard