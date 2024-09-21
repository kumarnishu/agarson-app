import {  Grid, Paper, Stack, Typography } from "@mui/material"
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
    user?.assigned_permissions.includes('pending_orders_view') && tmpfeatures.push({ feature: 'pending orders report', is_visible: true, url: "/ErpReports/PendingOrdersReport" })
    user?.assigned_permissions.includes('bills_ageing_view') && tmpfeatures.push({ feature: 'bills aging  report', is_visible: true, url: "/ErpReports/BillsAgingReportPage" })
    user?.assigned_permissions.includes('client_sale_report_view') && tmpfeatures.push({ feature: 'Client Sale  report', is_visible: true, url: "/ErpReports/ClientSaleReportsPage" }),
      user?.assigned_permissions.includes('last_year_client_sale_report_view') && tmpfeatures.push({ feature: 'Client Sale Last Year report', is_visible: true, url: "/ErpReports/ClientSaleLastYearReportsPage" }),
      user?.assigned_permissions.includes('party_target_view') && tmpfeatures.push({ feature: 'Party Target report', is_visible: true, url: "/ErpReports/PartyTargetReportsPage" }),
      user?.assigned_permissions.includes('sale_analysis_view') && tmpfeatures.push({ feature: 'Sale Analysis report', is_visible: true, url: "/ErpReports/SaleAnalysisReport" }),
      user?.assigned_permissions.includes('erp_state_view') && tmpfeatures.push({ feature: 'states', is_visible: true, url: "/ErpReports/ErpStatesPage" })
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
                      {feat.feature.toUpperCase()}
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