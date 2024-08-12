import {  Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import  {  ButtonLogo } from "../components/logo/Agarson";

function ProductionDashboard() {
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])
  const { user } = useContext(UserContext)

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    user?.assigned_permissions.includes('production_view') && tmpfeatures.push({ feature: 'production ', is_visible: true, url: paths.production_admin })
    user?.assigned_permissions.includes('dye_status_view') && tmpfeatures.push({ feature: 'Dye-Status ', is_visible: true, url: paths.production_admin })
    user?.assigned_permissions.includes('dye_location_view') && tmpfeatures.push({ feature: 'Location ', is_visible: true, url: paths.dye_location })
    user?.assigned_permissions.includes('article_view') && tmpfeatures.push({ feature: 'articles', is_visible: true, url: paths.articles })
    user?.assigned_permissions.includes('machine_view') && tmpfeatures.push({ feature: 'machines ', is_visible: true, url: paths.machines })
    user?.assigned_permissions.includes('machine_category_view') && tmpfeatures.push({ feature: 'machine categories ', is_visible: true, url: paths.machine_categories })
    user?.assigned_permissions.includes('dye_view') && tmpfeatures.push({ feature: 'dyes ', is_visible: true, url: paths.dyes })
    user?.assigned_permissions.includes('shoe_weight_view') && tmpfeatures.push({ feature: 'shoe weight ', is_visible: true, url: paths.shoe_weight })
    user?.assigned_permissions.includes('pending_orders_view') && tmpfeatures.push({ feature: 'Shoe Weight Difference report', is_visible: true, url: paths.shoe_weightdiffreport })
    user?.assigned_permissions.includes('pending_orders_view') && tmpfeatures.push({ feature: 'Dye Status report', is_visible: true, url: paths.dye_statusrepot })
    user?.assigned_permissions.includes('machine_wise_production_report_view') && tmpfeatures.push({ feature: 'Machine Wise production report', is_visible: true, url: paths.machine_wise_productionrepot })
    user?.assigned_permissions.includes('machine_category_wise_production_report_view') && tmpfeatures.push({ feature: 'Category Wise Production report', is_visible: true, url: paths.category_wise_productionrepot }),
      user?.assigned_permissions.includes('thekedar_wise_production_report_view') && tmpfeatures.push({ feature: 'Thekedar Wise production report', is_visible: true, url: paths.thekedar_wise_productionrepot })
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


export default ProductionDashboard