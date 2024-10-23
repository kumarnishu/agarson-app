import { Grid, Paper, Stack, Typography } from "@mui/material"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { ButtonLogo } from "../components/logo/Agarson";

function ReportDashboard() {
    const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])
    const { user } = useContext(UserContext)

    useEffect(() => {
        let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
        user?.assigned_permissions.includes('pending_orders_view') && tmpfeatures.push({ feature: 'pending orders report', is_visible: true, url: "PendingOrdersReport" })
        user?.assigned_permissions.includes('bills_ageing_view') && tmpfeatures.push({ feature: 'bills aging  report', is_visible: true, url: "BillsAgingReportPage" })
        user?.assigned_permissions.includes('client_sale_report_view') && tmpfeatures.push({ feature: 'Client Sale  report', is_visible: true, url: "ClientSaleReportsPage" }),
        user?.assigned_permissions.includes('last_year_client_sale_report_view') && tmpfeatures.push({ feature: 'Client Sale Last Year report', is_visible: true, url: "ClientSaleLastYearReportsPage" }),
        user?.assigned_permissions.includes('party_target_view') && tmpfeatures.push({ feature: 'Party Target report', is_visible: true, url: "PartyTargetReportsPage" }),
        user?.assigned_permissions.includes('sale_analysis_view') && tmpfeatures.push({ feature: 'Sale Analysis report', is_visible: true, url: "SaleAnalysisReport" }),
        setFeatures(tmpfeatures)
        user?.assigned_permissions.includes('activities_view') && tmpfeatures.push({ feature: 'activities reports ', is_visible: true, url: "CrmActivitiesPage" })
        user?.assigned_permissions.includes('assignedrefer_view') && tmpfeatures.push({ feature: 'assigned refer reports', is_visible: true, url: "AssignedReferReportPage" })
        user?.assigned_permissions.includes('newrefer_view') && tmpfeatures.push({ feature: 'new customer reports ', is_visible: true, url: "NewReferReportPage" })
        user?.assigned_permissions.includes('shoe_weight_report_view') && tmpfeatures.push({ feature: 'Shoe Weight Difference report', is_visible: true, url: "ShowWeightDifferenceReportPage" })
        user?.assigned_permissions.includes('dye_status_report_view') && tmpfeatures.push({ feature: 'Dye Status report', is_visible: true, url: "DyeStatusReportPage" })
        user?.assigned_permissions.includes('machine_wise_production_report_view') && tmpfeatures.push({ feature: 'Machine Wise production report', is_visible: true, url: "MachineWiseProductionReportPage" })
        user?.assigned_permissions.includes('machine_category_wise_production_report_view') && tmpfeatures.push({ feature: 'Category Wise Production report', is_visible: true, url: "CategoryWiseProductionReportPage" }),
        user?.assigned_permissions.includes('thekedar_wise_production_report_view') && tmpfeatures.push({ feature: 'Thekedar Wise production report', is_visible: true, url: "ThekedarWiseProductionReportPage" })
        
        user?.is_admin && tmpfeatures.push({ feature: 'salesmen visit report ', is_visible: false, url: "ThekedarWiseProductionReportPage" })
    }, [user])

    return (
        <>
            <Grid container sx={{ pt: 2 }} >
                {features.map((feat, index) => {
                    return (
                        <Grid key={index} item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                            <Link to={feat.url} style={{ textDecoration: 'none' }}>
                                <Paper sx={{ p: 2, m: 0, height: 80,  boxShadow: 2, borderRadius: 5, borderColor: 'white' }} >
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


export default ReportDashboard