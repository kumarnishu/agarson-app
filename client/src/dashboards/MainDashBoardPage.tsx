import { Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { ButtonLogo } from "../components/logo/Agarson";


function MainDashBoardPage() {
  const { user } = useContext(UserContext)
  const [features, setFeatures] = useState<{ feature: string, url: string, icon?: Element }[]>([])

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, url: string }[] = []
    user?.is_admin && tmpfeatures.push({ feature: 'users', url: paths.user_dashboard })
    user?.assigned_permissions.includes('crm_menu') && tmpfeatures.push({ feature: 'crm', url: paths.crm_dashboard })
    user?.assigned_permissions.includes('production_menu') && tmpfeatures.push({ feature: 'productions', url: paths.production_dashboard })
    user?.assigned_permissions.includes('erp_report_menu') && tmpfeatures.push({ feature: 'erp reports', url: paths.erp_reports_dashboard })
    user?.is_admin && tmpfeatures.push({ feature: 'Todos', url: paths.todo_dashboard })
    // tmpfeatures.push({ feature: 'Visit', url: paths.visit_dashboard })
    user?.is_admin && tmpfeatures.push({ feature: 'Checklist', url: paths.checklist_dashboard })
    // tmpfeatures.push({ feature: 'Templates', url: paths.templates_dashboard })
    // tmpfeatures.push({ feature: 'BackUp', url: paths.backup_dashboard })
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
    </Grid >
    <Outlet />
  </>

)
}


export default MainDashBoardPage