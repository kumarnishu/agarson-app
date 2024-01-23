import { Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { BlueAgarsonLogo } from "../components/logo/Agarson";
import { Feature } from "../types/access.types";

function MainDashBoardPage() {
  const { user } = useContext(UserContext)
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string, icon?: Element }[]>([])

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    !user?.user_access_fields.is_hidden && tmpfeatures.push({ feature: Feature.users, is_visible: true, url: paths.user_dashboard })
    !user?.crm_access_fields.is_hidden && tmpfeatures.push({ feature: Feature.crm, is_visible: true, url: paths.crm_dashboard })
    !user?.todos_access_fields.is_hidden && tmpfeatures.push({ feature: Feature.todos, is_visible: true, url: paths.todo_dashboard })
    !user?.visit_access_fields.is_hidden && tmpfeatures.push({ feature: Feature.visit, is_visible: true, url: paths.visit_dashboard })
    !user?.productions_access_fields.is_hidden && tmpfeatures.push({ feature: Feature.productions, is_visible: true, url: paths.production_dashboard })
    !user?.checklists_access_fields.is_hidden && tmpfeatures.push({ feature: Feature.checklists, is_visible: true, url: paths.checklist_dashboard })
    !user?.templates_access_fields.is_hidden && tmpfeatures.push({ feature: Feature.templates, is_visible: true, url: paths.templates_dashboard })
    !user?.reports_access_fields.is_hidden && tmpfeatures.push({ feature: Feature.reports, is_visible: true, url: paths.reports_dashboard })
    !user?.greetings_access_fields.is_hidden && tmpfeatures.push({ feature: Feature.greetings, is_visible: true, url: paths.greetings_dashboard })
    !user?.passwords_access_fields.is_hidden && tmpfeatures.push({ feature: Feature.erp_login, is_visible: true, url: paths.erp_login_dashboard })
    !user?.backup_access_fields.is_hidden && tmpfeatures.push({ feature: Feature.backup, is_visible: true, url: paths.backup_dashboard })

    setFeatures(tmpfeatures)

  }, [user])

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
      <Outlet />
    </>

  )
}


export default MainDashBoardPage