import { Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { ButtonLogo } from "../components/logo/Agarson";

function CrmReportsDashboard() {
    const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])
    const { user } = useContext(UserContext)

    //process feature and access
    useEffect(() => {
        let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
        user?.assigned_permissions.includes('pending_orders_view') && tmpfeatures.push({ feature: 'Activities ', is_visible: true, url: paths.pending_orders })
        user?.assigned_permissions.includes('bills_ageing_view') && tmpfeatures.push({ feature: 'Refer Reports', is_visible: true, url: paths.bill_aging_report })
        user?.assigned_permissions.includes('client_sale_report_view') && tmpfeatures.push({ feature: 'New Refers ', is_visible: true, url: paths.clients_sale })
        setFeatures(tmpfeatures)
    }, [])

    return (
        <>
            <Grid container sx={{ pt: 2 }} >
                {features.map((feat, index) => {
                    return (
                        <Grid key={index} item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                            <Link to={feat.url} style={{ textDecoration: 'none' }}>
                                <Paper sx={{ p: 2, m: 0,  boxShadow: 2, borderRadius: 5, borderColor: 'white' }} >
                                    <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                                        <ButtonLogo title="" height={40} width={40} />
                                        <Typography  variant="button" fontSize={15} component="div">
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


export default CrmReportsDashboard