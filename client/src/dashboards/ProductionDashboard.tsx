import { Grid, Paper, Stack, Typography } from "@mui/material"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { ButtonLogo } from "../components/logo/Agarson";

function ProductionDashboard() {
  const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])
  const { user } = useContext(UserContext)

  //process feature and access
  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
    user?.assigned_permissions.includes('production_view') && tmpfeatures.push({ feature: 'production ', is_visible: true, url: "/Production/ProductionAdminPage" })
    user?.assigned_permissions.includes('spare_dye_view') && tmpfeatures.push({ feature: 'Spare Dyes ', is_visible: true, url: "/Production/SpareDyesPage" })
    user?.assigned_permissions.includes('sole_thickness_view') && tmpfeatures.push({ feature: 'Sole Thickness ', is_visible: true, url: "/Production/SoleThicknessPage" })
    user?.assigned_permissions.includes('dye_location_view') && tmpfeatures.push({ feature: 'Dye-Location  ', is_visible: true, url: "/Production/DyeLocationsPage" })
    user?.assigned_permissions.includes('article_view') && tmpfeatures.push({ feature: 'articles', is_visible: true, url: "/Production/ArticlePage" })
    user?.assigned_permissions.includes('machine_view') && tmpfeatures.push({ feature: 'machines ', is_visible: true, url: "/Production/MachinePage" })
    user?.assigned_permissions.includes('machine_category_view') && tmpfeatures.push({ feature: 'machine categories ', is_visible: true, url: "/Production/UpdateMachineCategoriesPage" })
    user?.assigned_permissions.includes('dye_view') && tmpfeatures.push({ feature: 'dyes ', is_visible: true, url: "/Production/DyePage" })
    user?.assigned_permissions.includes('shoe_weight_view') && tmpfeatures.push({ feature: 'shoe weight ', is_visible: true, url: "/Production/ShoeWeightPage" })
    user?.assigned_permissions.includes('shoe_weight_report_view') && tmpfeatures.push({ feature: 'Shoe Weight Difference report', is_visible: true, url: "/Production/ShowWeightDifferenceReportPage" })
    user?.assigned_permissions.includes('dye_status_report_view') && tmpfeatures.push({ feature: 'Dye Status report', is_visible: true, url: "/Production/DyeStatusReportPage" })
    user?.assigned_permissions.includes('machine_wise_production_report_view') && tmpfeatures.push({ feature: 'Machine Wise production report', is_visible: true, url: "/Production/MachineWiseProductionReportPage" })
    user?.assigned_permissions.includes('machine_category_wise_production_report_view') && tmpfeatures.push({ feature: 'Category Wise Production report', is_visible: true, url: "/Production/CategoryWiseProductionReportPage" }),
      user?.assigned_permissions.includes('thekedar_wise_production_report_view') && tmpfeatures.push({ feature: 'Thekedar Wise production report', is_visible: true, url: "/Production/ThekedarWiseProductionReportPage" })
    user?.assigned_permissions.includes('sole_thickness_report_view') && tmpfeatures.push({ feature: 'Sole Thickness report', is_visible: true, url: "/Production/SoleThicknessReportPage" })
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


export default ProductionDashboard