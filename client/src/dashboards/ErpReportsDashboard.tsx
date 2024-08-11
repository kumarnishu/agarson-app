import {  Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { ButtonLogo } from "../components/logo/Agarson";

function ErpReportsDashboard() {
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])
  const { user } = useContext(UserContext)

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    user?.assigned_permissions.includes('pending_orders_view') && tmpfeatures.push({ feature: 'pending orders report', is_visible: true, url: paths.pending_orders })
    user?.assigned_permissions.includes('bills_ageing_view') && tmpfeatures.push({ feature: 'bills aging  report', is_visible: true, url: paths.bill_aging_report })
    user?.assigned_permissions.includes('client_sale_report_view') && tmpfeatures.push({ feature: 'Client Sale  report', is_visible: true, url: paths.clients_sale }),
      user?.assigned_permissions.includes('last_year_client_sale_report_view') && tmpfeatures.push({ feature: 'Client Sale Last Year report', is_visible: true, url: paths.clients_sale_lastyear }),
      user?.assigned_permissions.includes('party_target_view') && tmpfeatures.push({ feature: 'Party Target report', is_visible: true, url: paths.party_target }),
      user?.assigned_permissions.includes('sale_analysis_view') && tmpfeatures.push({ feature: 'Sale Analysis report', is_visible: true, url: paths.sale_analysis }),
      user?.assigned_permissions.includes('erp_state_view') && tmpfeatures.push({ feature: 'states', is_visible: true, url: paths.states })
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


export default ErpReportsDashboard