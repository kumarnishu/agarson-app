import { Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppsIcon from '@mui/icons-material/Apps';
import { UserContext } from "../contexts/userContext";
import { is_authorized } from "../utils/auth";

function CrmDashboard() {
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])
  const { user } = useContext(UserContext)
  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    user?.assigned_roles && is_authorized('leads_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'leads ', is_visible: true, url: paths.leads })
    user?.assigned_roles && is_authorized('refer_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'refers', is_visible: true, url: paths.refers })
    user?.assigned_roles && is_authorized('reminders_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'reminders', is_visible: true, url: paths.crm_reminders })
    user?.assigned_roles && is_authorized('activities_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'activities', is_visible: true, url: paths.crm_activities })
    user?.assigned_roles && is_authorized('states_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'states', is_visible: true, url: paths.crm_states })
    user?.assigned_roles && is_authorized('city_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'cities', is_visible: true, url: paths.crm_cities })
    user?.assigned_roles && is_authorized('leadtype_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'Lead Type', is_visible: true, url: paths.crm_leadtypes })
    user?.assigned_roles && is_authorized('lead_source_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'Lead Source', is_visible: true, url: paths.crm_leadsources })
    user?.assigned_roles && is_authorized('leadstage_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'Lead Stage', is_visible: true, url: paths.crm_stages })
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