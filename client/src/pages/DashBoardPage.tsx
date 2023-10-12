import { Box, Card, CardContent, Grid, Typography } from "@mui/material"
import { paths } from "../Routes"
import Person3Icon from '@mui/icons-material/Person3';
import BackupIcon from '@mui/icons-material/Backup';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link } from "react-router-dom";
import { Apartment, Article, Phone, PunchClock } from "@mui/icons-material";
import { useGlobalFields } from "../components/hooks/GlobalFieldsHook";

function DashBoardPage() {
  const { user } = useContext(UserContext)
  const { hiddenFields } = useGlobalFields()
  return (
    <>
      <Box sx={{ bgcolor: "white", m: 0, pt: 2 }}>
        <Grid container >

          {user?.created_by._id === user?._id &&
            <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={paths.users} style={{ textDecoration: 'none' }}>
                <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                  <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                    <Person3Icon sx={{ color: 'blue', height: 50, width: 50 }} />
                    <Typography variant="button" sx={{ color: 'blue', fontSize: 16 }} component="div">
                      Users
                    </Typography>
                  </CardContent>

                </Card>
              </Link>
            </Grid>}
          {!hiddenFields?.includes('Crm') && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.crm} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <Diversity3Icon sx={{ color: 'black', height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ color: 'black', fontSize: 16 }} component="div">
                    CRM
                  </Typography>
                </CardContent>

              </Card>
            </Link>
          </Grid>}
          <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.alps} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <Apartment sx={{ color: 'black', height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ color: 'black', fontSize: 16 }} component="div">
                    ALPS
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>

          {!hiddenFields?.includes('Bot') &&
            <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={paths.bot} style={{ textDecoration: 'none' }}>
                <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                  <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                    <WhatsAppIcon sx={{ color: 'green', height: 50, width: 50 }} />
                    <Typography variant="button" sx={{ color: 'green', fontSize: 16 }} component="div">
                      WA BOT
                    </Typography>
                  </CardContent>

                </Card>
              </Link>
            </Grid>}
          {!hiddenFields?.includes('Templates') &&
            <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={paths.templates} style={{ textDecoration: 'none' }}>
                <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                  <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                    <Article sx={{ color: 'green', height: 50, width: 50 }} />
                    <Typography variant="button" sx={{ color: 'green', fontSize: 16 }} component="div">
                      Templates
                    </Typography>
                  </CardContent>

                </Card>
              </Link>
            </Grid>}
          {!hiddenFields?.includes('Broadcasts') &&
            <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={paths.broadcast} style={{ textDecoration: 'none' }}>
                <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                  <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                    <CampaignIcon sx={{ color: 'green', height: 50, width: 50 }} />
                    <Typography variant="button" sx={{ color: 'green', fontSize: 16 }} component="div">
                      Broadcast
                    </Typography>
                  </CardContent>

                </Card>
              </Link>
            </Grid>}
          {!hiddenFields?.includes('Contacts') &&
            <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={paths.contacts} style={{ textDecoration: 'none' }}>
                <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                  <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                    <Phone sx={{ color: 'green', height: 50, width: 50 }} />
                    <Typography variant="button" sx={{ color: 'green', fontSize: 16 }} component="div">
                      Contacts
                    </Typography>
                  </CardContent>

                </Card>
              </Link>
            </Grid>}

          {!hiddenFields?.includes('Reminders') &&
            <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={paths.reminders} style={{ textDecoration: 'none' }}>
                <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                  <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                    <PunchClock sx={{ color: 'green', height: 50, width: 50 }} />
                    <Typography variant="button" sx={{ color: 'green', fontSize: 16 }} component="div">
                      Reminders
                    </Typography>
                  </CardContent>

                </Card>
              </Link>
            </Grid>}
          {!hiddenFields?.includes('Backup Database') &&
            <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={paths.backup_page} style={{ textDecoration: 'none' }}>
                <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                  <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                    <BackupIcon sx={{ color: 'brown', height: 50, width: 50 }} />
                    <Typography variant="button" sx={{ color: 'brown', fontSize: 16 }} component="div">
                      Backup Database
                    </Typography>
                  </CardContent>

                </Card>
              </Link>
            </Grid>}
        </Grid>
      </Box >
    </>
  )
}


export default DashBoardPage