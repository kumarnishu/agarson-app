import { Button, Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";



function MainDashBoardPage() {
  const { user } = useContext(UserContext)
  const [features, setFeatures] = useState<{ feature: string, url: string, icon?: Element }[]>([])

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, url: string }[] = []
    user?.is_admin && tmpfeatures.push({ feature: 'users', url: paths.user_dashboard })
    user?.assigned_permissions.includes('crm_menu') && tmpfeatures.push({ feature: 'crm', url: paths.crm_dashboard })
    user?.assigned_permissions.includes('erp_report_menu') && tmpfeatures.push({ feature: 'erp reports', url: paths.erp_dashboard })
    user?.assigned_permissions.includes('production_menu') && tmpfeatures.push({ feature: 'productions', url: paths.production_dashboard })

    // if (user?.is_admin) {
    //   tmpfeatures.push({ feature: Feature.todos, url: paths.todo_dashboard })
    //   tmpfeatures.push({ feature: Feature.visit, url: paths.visit_dashboard })
    //   tmpfeatures.push({ feature: Feature.checklists, url: paths.checklist_dashboard })
    //   tmpfeatures.push({ feature: Feature.templates, url: paths.templates_dashboard })
    //   tmpfeatures.push({ feature: Feature.backup, url: paths.backup_dashboard })
    // }
    setFeatures(tmpfeatures)

  }, [user])

  return (
    <>
      <Grid container sx={{ pt: 2 }} >
        {features.map((feat, index) => {
          return (
            <Grid key={index} item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={feat.url} style={{ textDecoration: 'none' }}>
                <Paper sx={{ p: 2, bgcolor: 'white', boxShadow: 2, border: 10, borderRadius: 1, borderColor: 'white' }}>
                  <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                    <Button variant="contained" sx={{ height: 60, width: 60, borderRadius: '50%', fontSize: 18 }}>{index + 1}</Button>
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
      <Outlet />
    </>

  )
}


export default MainDashBoardPage