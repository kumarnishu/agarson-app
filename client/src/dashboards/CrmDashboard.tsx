import {  Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { ButtonLogo } from "../components/logo/Agarson";

function CrmDashboard() {
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])
  const { user } = useContext(UserContext)

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    user?.assigned_permissions.includes('leads_view') && tmpfeatures.push({ feature: 'leads ', is_visible: true, url: paths.leads })
    user?.assigned_permissions.includes('refer_view') &&tmpfeatures.push({ feature: 'refers', is_visible: true, url: paths.refers })
    user?.assigned_permissions.includes('reminders_view') &&tmpfeatures.push({ feature: 'reminders', is_visible: true, url: paths.crm_reminders })
    user?.assigned_permissions.includes('states_view') &&tmpfeatures.push({ feature: 'states', is_visible: true, url: paths.crm_states })
    user?.assigned_permissions.includes('city_view') &&tmpfeatures.push({ feature: 'cities', is_visible: true, url: paths.crm_cities })
    user?.assigned_permissions.includes('leadtype_view') &&tmpfeatures.push({ feature: 'Lead Type', is_visible: true, url: paths.crm_leadtypes })
    user?.assigned_permissions.includes('lead_source_view') &&tmpfeatures.push({ feature: 'Lead Source', is_visible: true, url: paths.crm_leadsources })
    user?.assigned_permissions.includes('leadstage_view') &&tmpfeatures.push({ feature: 'Lead Stage', is_visible: true, url: paths.crm_stages })
    user?.assigned_permissions.includes('pending_orders_view') && tmpfeatures.push({ feature: 'activities reports ', is_visible: true, url: paths.crm_activities })
    user?.assigned_permissions.includes('bills_ageing_view') && tmpfeatures.push({ feature: 'assigned refer reports', is_visible: true, url: paths.refer_reports })
    user?.assigned_permissions.includes('client_sale_report_view') && tmpfeatures.push({ feature: 'new refer reports ', is_visible: true, url: paths.new_refers })
    setFeatures(tmpfeatures)

  }, [user])

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


export default CrmDashboard