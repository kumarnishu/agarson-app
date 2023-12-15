import { Box, Card, CardContent, Grid, Typography } from "@mui/material"
import { paths } from "../Routes"
import BackupIcon from '@mui/icons-material/Backup';
import CampaignIcon from '@mui/icons-material/Campaign';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link } from "react-router-dom";
import { ApartmentOutlined, Article, Book, CheckBoxOutlined, Diversity3Outlined, Person3Outlined, Phone, PunchClock, TaskAltOutlined, TodayOutlined, TourOutlined } from "@mui/icons-material";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";
import AppShortcutIcon from '@mui/icons-material/AppShortcut';

function DashBoardPage() {
  const { user } = useContext(UserContext)
  return (
    <>
      <Box sx={{ bgcolor: "white", m: 0, pt: 2 }}>
        <Grid container >
          {/* users */}
          {!user?.user_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.users} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <Person3Outlined sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    Users
                  </Typography>
                </CardContent>

              </Card>
            </Link>
          </Grid>}
          {!user?.todos_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.todos} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ color: 'red', display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <TaskAltOutlined sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ color: 'red', fontSize: 16 }} component="div">
                    Todos
                  </Typography>
                </CardContent>

              </Card>
            </Link>
          </Grid>}
          {!user?.tasks_access_fields.is_hidden &&
            <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={paths.tasks} style={{ textDecoration: 'none' }}>
                <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                  <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                    <TodayOutlined sx={{ height: 50, width: 50 }} />
                    <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                      Tasks
                    </Typography>
                  </CardContent>

                </Card>
              </Link>
            </Grid>}
          {!user?.checklists_access_fields.is_hidden &&
            <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
              <Link to={paths.checklists} style={{ textDecoration: 'none' }}>
                <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                  <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                    <CheckBoxOutlined sx={{ height: 50, width: 50 }} />
                    <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                      CheckLists
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>}
          {/* crm */}
          {!user?.crm_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.crm} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <Diversity3Outlined sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    CRM
                  </Typography>
                </CardContent>

              </Card>
            </Link>
          </Grid>}
          {!user?.reports_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.reports} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <Book sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    Reports
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>}
          {!user?.visit_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.visit} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <TourOutlined sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    My Visit
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>}
          {/* alps */}
          {!user?.alps_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.alps} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <ApartmentOutlined sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    ALPS
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>}


          {/* bot */}
          {!user?.bot_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.bot} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <WhatsAppIcon sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    WA BOT
                  </Typography>
                </CardContent>

              </Card>
            </Link>
          </Grid>}

          {/* templates */}
          {!user?.templates_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.templates} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <Article sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    Templates
                  </Typography>
                </CardContent>

              </Card>
            </Link>
          </Grid>}
          {/* broadcast */}
          {!user?.broadcast_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.broadcast} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <CampaignIcon sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    Broadcast
                  </Typography>
                </CardContent>

              </Card>
            </Link>
          </Grid>
          }

          {/* contacts */}
          {!user?.contacts_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.contacts} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <Phone sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    Contacts
                  </Typography>

                </CardContent>
              </Card>
            </Link>
          </Grid>}


          {/* reminders */}
          {!user?.reminders_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.reminders} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <PunchClock sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    Reminders
                  </Typography>
                </CardContent>

              </Card>
            </Link>
          </Grid>
          }
          {/* greetings */}
          {user?.is_admin && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.greetings} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <AppShortcutIcon sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    Greetings
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          }
          

          {/* backup */}
          {!user?.backup_access_fields.is_hidden && <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
            <Link to={paths.backup_page} style={{ textDecoration: 'none' }}>
              <Card sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                  <BackupIcon sx={{ height: 50, width: 50 }} />
                  <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                    Backup Database
                  </Typography>
                </CardContent>

              </Card>
            </Link>
          </Grid>
          }

        </Grid>
      </Box >
    </>
  )
}


export default DashBoardPage