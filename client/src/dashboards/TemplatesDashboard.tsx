import { Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ButtonLogo } from "../components/logo/Agarson";

function TemplatesDashboard() {
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    tmpfeatures.push({ feature: 'templates ', is_visible: true, url: paths.templates })
    tmpfeatures.push({ feature: 'template categories', is_visible: true, url: paths.template_categories })
    setFeatures(tmpfeatures)
  }, [])

  return (
    <>
      <Grid container sx={{ pt: 2 }} >
        {features.map((feat, index) => {
          return (
            <Grid key={index} item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={feat.url} style={{ textDecoration: 'none' }}>
                <Paper sx={{ p: 2, m: 0, height: 80, bgcolor: feat.feature.includes('report') ? 'lightblue' : 'white', boxShadow: 2, borderRadius: 5, borderColor: 'white' }} >
                  <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                    <ButtonLogo title="" height={50} width={50} />
                    <Typography variant="button" fontSize={15} component="div">
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


export default TemplatesDashboard