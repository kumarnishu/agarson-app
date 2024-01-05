import { Box, Card, CardContent, Grid, Typography } from "@mui/material"
import BackupIcon from '@mui/icons-material/Backup';
import CampaignIcon from '@mui/icons-material/Campaign';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { ApartmentOutlined, Article, Book, CheckBoxOutlined, Diversity3Outlined, Key, LanSharp, Person3Outlined, Phone, PunchClock, TaskAltOutlined, TodayOutlined, TourOutlined } from "@mui/icons-material";
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import { useState } from "react";
import ManageFeatureControlDialog from "../../components/dialogs/users/ManageFeatureControlDialog";
import { Feature } from "../../types/access.types";

function FeatureAccessReportPage() {
    const [feature, setFeature] = useState<string>()
    return (
        <>
            <Typography variant="h6" sx={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', p: 1 }}>Manage Features Access</Typography>
            <Box sx={{ bgcolor: "white", m: 0, pt: 2 }}>
                <Grid container >
                    {/* users */}
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.users)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <Person3Outlined sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    Users
                                </Typography>
                            </CardContent>

                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.todos)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ color: 'red', display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <TaskAltOutlined sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ color: 'red', fontSize: 16 }} component="div">
                                    Todos
                                </Typography>
                            </CardContent>

                        </Card>
                    </Grid>

                    < Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>

                        <Card 
                        onClick={()=>setFeature(Feature.tasks)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <TodayOutlined sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    Tasks
                                </Typography>
                            </CardContent>

                        </Card>
                    </Grid>

                    < Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>

                        <Card 
                        onClick={()=>setFeature(Feature.checklists)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <CheckBoxOutlined sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    CheckLists
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* crm */}
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.crm)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <Diversity3Outlined sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    CRM
                                </Typography>
                            </CardContent>

                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.reports)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <Book sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    Reports
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.visit)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <TourOutlined sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    My Visit
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* alps */}
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.alps)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <ApartmentOutlined sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    ALPS
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>


                    {/* bot */}
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.bot)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <WhatsAppIcon sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    WA BOT
                                </Typography>
                            </CardContent>

                        </Card>
                    </Grid>

                    {/* templates */}
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.templates)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <Article sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    Templates
                                </Typography>
                            </CardContent>

                        </Card>
                    </Grid>
                    {/* broadcast */}
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.broadcast)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <CampaignIcon sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    Broadcast
                                </Typography>
                            </CardContent>

                        </Card>
                    </Grid>


                    {/* contacts */}
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.contacts)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <Phone sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    Contacts
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                            <Card
                            onClick={() => setFeature(Feature.productions)}
                            sx={{ bgcolor: 'white', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                                <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                    <LanSharp sx={{ height: 50, width: 50 }} />
                                    <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                        Production
                                    </Typography>
                                </CardContent>
                            </Card>
                    </Grid>

                    {/* reminders */}
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.reminders)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <PunchClock sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    Reminders
                                </Typography>
                            </CardContent>

                        </Card>
                    </Grid>

                    {/* greetings */}
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.greetings)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <AppShortcutIcon sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    Greetings
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* passwords */}
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.erp_login)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <Key sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    Erp Login
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>



                    {/* backup */}
                    <Grid item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Card 
                        onClick={()=>setFeature(Feature.backup)}
                        sx={{ bgcolor: 'white', cursor: 'pointer', boxShadow: 4, border: 10, borderRadius: 3, borderColor: 'white' }}>
                            <CardContent sx={{ display: 'flex', direction: "row", alignItems: "center", gap: 2 }}>
                                <BackupIcon sx={{ height: 50, width: 50 }} />
                                <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                    Backup Database
                                </Typography>
                            </CardContent>

                        </Card>
                    </Grid>

                </Grid >
            </Box >
            {feature && <ManageFeatureControlDialog feature={feature} setFeature={setFeature} />}
        </>
    )
}


export default FeatureAccessReportPage