import {  Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import {  useEffect, useState } from "react";
import { ButtonLogo } from "../components/logo/Agarson";

function TodoDashboard() {
    const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])

    //process feature and access
    useEffect(() => {
        let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
        tmpfeatures.push({ feature: 'my todos ', is_visible: true, url: paths.todo })
        tmpfeatures.push({ feature: 'todos admin', is_visible: true, url: paths.todo_admin })
        setFeatures(tmpfeatures)
        
    }, [])

    return (
        <>
            <Grid container sx={{ pt: 2 }} >
                {features.map((feat, index) => {
                    return (
                        <Grid key={index} item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                            <Link to={feat.url} style={{ textDecoration: 'none' }}>
                                <Paper sx={{ p: 2, m: 0, bgcolor: feat.feature.includes('report') ? 'black' : 'blue', boxShadow: 2, borderRadius: 5, borderColor: 'white' }} >
                                    <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                                        <ButtonLogo title="" height={40} width={40} />
                                        <Typography color={'white'} variant="button" fontSize={15} component="div">
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


export default TodoDashboard