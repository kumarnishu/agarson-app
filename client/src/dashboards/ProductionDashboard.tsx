import { Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppsIcon from '@mui/icons-material/Apps';
import { UserContext } from "../contexts/userContext";
import { is_authorized } from "../utils/auth";

function ProductionDashboard() {
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])
  const { user } = useContext(UserContext)

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    user?.assigned_roles && is_authorized('production_view', user?.assigned_roles) &&tmpfeatures.push({ feature: 'production ', is_visible: true, url: paths.production_admin })
    user?.assigned_roles && is_authorized('article_view', user?.assigned_roles) &&tmpfeatures.push({ feature: 'articles', is_visible: true, url: paths.articles })
    user?.assigned_roles && is_authorized('machine_view', user?.assigned_roles) &&tmpfeatures.push({ feature: 'machines ', is_visible: true, url: paths.machines })
    user?.assigned_roles && is_authorized('machine_category_view', user?.assigned_roles) &&tmpfeatures.push({ feature: 'machine categories ', is_visible: true, url: paths.machine_categories })
    user?.assigned_roles && is_authorized('dye_view', user?.assigned_roles) &&tmpfeatures.push({ feature: 'dyes ', is_visible: true, url: paths.dyes })
    user?.assigned_roles && is_authorized('shoe_weight_view', user?.assigned_roles) &&tmpfeatures.push({ feature: 'shoe weight ', is_visible: true, url: paths.shoe_weight })

    user?.assigned_roles && is_authorized('shoe_weight_report_view', user?.assigned_roles) &&tmpfeatures.push({ feature: 'show weight report', is_visible: true, url: paths.articles })
    user?.assigned_roles && is_authorized('machine_wise_production_report_view', user?.assigned_roles) &&tmpfeatures.push({ feature: ' machine production ', is_visible: true, url: paths.machines })
    user?.assigned_roles && is_authorized('thekedar_wise_production_report_view', user?.assigned_roles) &&tmpfeatures.push({ feature: 'thekedar production ', is_visible: true, url: paths.dyes })
    user?.assigned_roles && is_authorized('machine_category_wise_production_report_view', user?.assigned_roles) &&tmpfeatures.push({ feature: 'm-category production ', is_visible: true, url: paths.machine_categories })

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


export default ProductionDashboard