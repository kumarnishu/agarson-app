import { Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppsIcon from '@mui/icons-material/Apps';
import { UserContext } from "../contexts/userContext";

function CrmDashboard() {
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])
  const { user } = useContext(UserContext)
  
  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    tmpfeatures.push({ feature: 'leads ', is_visible: true, url: paths.leads })
    tmpfeatures.push({ feature: 'customers', is_visible: true, url: paths.customers })
    tmpfeatures.push({ feature: 'refers', is_visible: true, url: paths.refers })
    tmpfeatures.push({ feature: 'useless', is_visible: true, url: paths.useless_leads })
    tmpfeatures.push({ feature: 'reminders', is_visible: true, url: paths.crm_reminders })
    tmpfeatures.push({ feature: 'activities', is_visible: true, url: paths.crm_activities })
    tmpfeatures.push({ feature: 'visitng cards', is_visible: true, url: paths.visiting_cards })
    user?.crm_access_fields.is_editable && tmpfeatures.push({ feature: 'fields', is_visible: true, url: paths.updateble_fields_lead })
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


export default CrmDashboard