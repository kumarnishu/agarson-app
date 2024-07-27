import { Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppsIcon from '@mui/icons-material/Apps';
import { UserContext } from "../contexts/userContext";
import { is_authorized } from "../utils/auth";

function ErpReportsDashboard() {
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])
  const { user } = useContext(UserContext)

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    user?.assigned_roles && is_authorized('pending_orders_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'pending orders ', is_visible: true, url: paths.pending_orders })
    user?.assigned_roles && is_authorized('bills_ageing_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'bills aging report ', is_visible: true, url: paths.bill_aging_report })
    user?.assigned_roles && is_authorized('client_sale_report_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'Client Sale report ', is_visible: true, url: paths.clients_sale }),
      user?.assigned_roles && is_authorized('last_year_client_sale_report_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'Client Sale Last Year ', is_visible: true, url: paths.clients_sale_lastyear }),
      user?.assigned_roles && is_authorized('party_target_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'Party Target ', is_visible: true, url: paths.party_target }),
      user?.assigned_roles && is_authorized('sale_analysis_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'Sale Analysis ', is_visible: true, url: paths.sale_analysis }),
      user?.assigned_roles && is_authorized('erp_state_view', user?.assigned_roles) && tmpfeatures.push({ feature: 'states', is_visible: true, url: paths.states })
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


export default ErpReportsDashboard