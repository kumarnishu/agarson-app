import { Grid, Paper, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Feature } from "../../types/access.types";
import AppsIcon from '@mui/icons-material/Apps';
import { paths } from "../../Routes";
import ManageFeatureControlDialog from "../../components/dialogs/users/ManageFeatureControlDialog";

function FeatureWiseAccessReportPage() {
    const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string, icon?: Element }[]>([])
    const [feature, setFeature] = useState<string>()

    //process feature and access
    useEffect(() => {
        let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
        tmpfeatures.push({ feature: Feature.users, is_visible: true, url: paths.user_dashboard })
        tmpfeatures.push({ feature: Feature.productions, is_visible: true, url: paths.production_dashboard })
        tmpfeatures.push({ feature: Feature.checklists, is_visible: true, url: paths.checklist_dashboard })
        tmpfeatures.push({ feature: Feature.crm, is_visible: true, url: paths.crm_dashboard })
        tmpfeatures.push({ feature: Feature.todos, is_visible: true, url: paths.todo_dashboard })
        tmpfeatures.push({ feature: Feature.visit, is_visible: true, url: paths.visit_dashboard })
        tmpfeatures.push({ feature: Feature.templates, is_visible: true, url: paths.templates_dashboard })
        tmpfeatures.push({ feature: Feature.erp_reports, is_visible: true, url: paths.erp_dashboard })
        tmpfeatures.push({ feature: Feature.backup, is_visible: true, url: paths.backup_dashboard })

        setFeatures(tmpfeatures)

    }, [])

    return (
        <>
            <Typography variant="h6" sx={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', p: 1 }}>Manage Features Access</Typography>
            <Grid container sx={{ pt: 1 }} >
                {features.map((feat, index) => {
                    return (
                        <Grid key={index} item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                            <Paper onClick={() => setFeature(feat.feature)} sx={{ p: 2, cursor: 'pointer', bgcolor: 'white', boxShadow: 2, border: 10, borderRadius: 3, borderColor: 'white' }}>
                                <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                                    <AppsIcon fontSize={'large'} />
                                    <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                        {feat.feature}
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    )
                })}
            </Grid>
            {feature && <ManageFeatureControlDialog feature={feature} setFeature={setFeature} />}
        </>
    )
}


export default FeatureWiseAccessReportPage