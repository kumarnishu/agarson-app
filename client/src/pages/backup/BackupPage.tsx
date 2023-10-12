import { Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import LeadsBackup from '../../components/backup/LeadsBackup'
import BackupIcon from '@mui/icons-material/Backup';

function BackupPage() {
    return (
        <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Card sx={{ bgcolor: 'whitesmoke', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'whitesmoke', p: 1 }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                    <BackupIcon sx={{ color: 'darkblue', height: 50, width: 50 }} />
                    <Typography variant="button" sx={{ color: 'darkblue', fontSize: 16 }} component="div">
                        Backup Leads
                    </Typography>
                </CardContent>
                <CardActions >
                    <LeadsBackup />
                </CardActions>
            </Card>
        </Grid>
    )
}

export default BackupPage