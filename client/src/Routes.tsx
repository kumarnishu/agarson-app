import { LinearProgress } from '@mui/material'
import React, { Suspense, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserContext } from './contexts/userContext'
import LoginPage from './pages/users/LoginPage'
import DashBoardNavBar from './components/navbar/DashBoardNavBar'
import CrmNavBar from './components/navbar/CrmNavBar'
import BotNavBar from './components/navbar/BotNavBar'
import BroadcastNavBar from './components/navbar/BroadcastNavBar'
import UsersNavBar from './components/navbar/UsersNavBar'
import EmailVerifyPage from './pages/users/EmailVerifyPage'
import UsersPage from './pages/users/UsersPage'
import DashBoardPage from './pages/DashBoardPage'
import LeadsPage from './pages/crm/LeadsPage'
import FlowsPage from './pages/bot/FlowsPage'
import BackupPage from './pages/backup/BackupPage'
import BroadcastPage from './pages/broadcast/BroadcastPage'
import UseLessLeadsPage from './pages/crm/UseLessLeadsPage'
import LeadReportsPage from './pages/crm/LeadReportsPage'
import TemplatesNavBar from './components/navbar/TemplatesNavBar'
import TemplatesPage from './pages/templates/TemplatesPage'
import ReminderNavBar from './components/navbar/ReminderNavBar'
import ReminderPage from './pages/reminders/ReminderPage'
import ContactNavBar from './components/navbar/ContactNavBar'
import ContactPage from './pages/contacts/ContactPage'
import AlpsNavBar from './components/navbar/AlpsNavBar'
import AlpsPage from './pages/alps/AlpsPage'

// lazy loding
const ResetPasswordDialog = React.lazy(() => import('./components/dialogs/users/ResetPasswordDialog'))
const CustomersPage = React.lazy(() => import('./pages/crm/CustomersPage'))
const ReferralPartyPage = React.lazy(() => import('./pages/crm/ReferralPartyPage'))
const UpdateLeadFieldsPage = React.lazy(() => import('./pages/crm/UpdateLeadFieldsPage'))
const TrackersPage = React.lazy(() => import('./pages/bot/TrackersPage'))

export enum paths {
  //crm
  crm = "/crm",
  leads = "leads",
  customers = "customers",
  updateble_fields_lead = "updateble_fields_lead",
  refers = "refers",
  useless_leads = "useless_leads",
  lead_reports = "leads_reports",

  //bot
  bot = "/bot",
  flows = "flows",
  trackers = "trackers",

  //broadcast 
  broadcast = "/broadcast",

  //reminders
  reminders = "reminders",

  //contacts
  contacts = "contacts",

  // templates
  templates = "templates",

  //users
  users = "users",
  login = "/",
  dashboard = "/",
  reset_password = "/password/reset/:token",
  verify_email = "/email/verify/:token",

  //backup
  backup_page = "backup_page",
  //alps
  alps = "alps"
}

function AppRoutes() {
  const { user } = useContext(UserContext)

  return (
    <Routes >
      {
        !user && <Route path={paths.login} element={<LoginPage />} />}
      {
        user && <Route>
          < Route element={<DashBoardNavBar />
          }>
            <Route
              path={paths.dashboard}
              element={
                <DashBoardPage />
              }
            />
          </Route>
          {/* users nav bar */}
          {!user.user_access_fields.is_hidden &&
            < Route path={paths.users} element={<UsersNavBar />}>
              <Route index
                element={
                  <UsersPage />
                }
              />
              <Route
                path={paths.users} element={
                  <UsersPage />
                }
              />
            </Route>}
          {/* crm nav bar */}

          {!user.crm_access_fields.is_hidden &&
            < Route path={paths.crm} element={<CrmNavBar />
            }>
              <Route index element={
                <LeadsPage />
              }
              />
              <Route path={paths.leads} index element={
                <Suspense fallback={<LinearProgress />}><LeadsPage /></Suspense>
              }
              />
              <Route
                path={paths.customers} element={
                  <Suspense fallback={<LinearProgress />}><CustomersPage /></Suspense>

                }
              />
              <Route
                path={paths.refers} element={
                  <Suspense fallback={<LinearProgress />}><ReferralPartyPage /></Suspense>

                }
              />
              <Route
                path={paths.updateble_fields_lead} element={
                  <Suspense fallback={<LinearProgress />}><UpdateLeadFieldsPage />
                  </Suspense>
                }
              />
              <Route
                path={paths.useless_leads} element={
                  <Suspense fallback={<LinearProgress />}><UseLessLeadsPage />
                  </Suspense>
                }
              />
              <Route
                path={paths.lead_reports} element={
                  <Suspense fallback={<LinearProgress />}><LeadReportsPage />
                  </Suspense>
                }
              />
            </Route>}
          {/* bot nav bar */}
          {!user.bot_access_fields.is_hidden &&
            < Route path={paths.bot} element={<BotNavBar />
            }>
              <Route
                index element={
                  <FlowsPage />
                }
              />
              <Route path={paths.flows} element={
                < FlowsPage />
              }
              />
              <Route path={paths.trackers} element={
                <Suspense fallback={<LinearProgress />}>
                  < TrackersPage />
                </Suspense>
              }
              />
            </Route>}

          {/* templates nav bar */}
          {!user.templates_access_fields.is_hidden &&
            < Route path={paths.templates} element={<TemplatesNavBar />
            }>

              <Route
                index element={
                  <TemplatesPage />
                }
              />
              <Route path={paths.templates} element={
                < TemplatesPage />
              }
              />
            </Route>}

          {/* broadcast nav bar */}
          {!user.broadcast_access_fields.is_hidden &&
            < Route path={paths.broadcast} element={<BroadcastNavBar />
            }>
              <Route
                index element={
                  <BroadcastPage />
                }
              />

            </Route>}
          {/* todo nav bar */}
          {!user.contacts_access_fields.is_hidden &&
            < Route path={paths.contacts} element={<ContactNavBar />
            }>
              <Route
                index element={
                  <ContactPage />
                }
              />

            </Route>}
          {/* reminder nav bar */}
          {!user.reminders_access_fields.is_hidden &&
            < Route path={paths.reminders} element={<ReminderNavBar />
            }>
              <Route
                index element={
                  <ReminderPage />
                }
              />
            </Route>}

          {/* crm nav bar */}
          {!user.alps_access_fields.is_hidden &&
            < Route path={paths.alps} element={<AlpsNavBar />
            }>
              <Route
                index element={
                  <AlpsPage />
                }
              />
            </Route>}
          {/* backup */}

          {!user.backup_access_fields.is_hidden &&
            <Route path={paths.backup_page} element={<DashBoardNavBar />}>
              <Route index
                element={
                  <BackupPage />
                }
              />
              <Route
                path={paths.backup_page} element={
                  <BackupPage />
                }
              />
            </Route>}
        </Route>
      }

      <Route path={paths.reset_password} element={<ResetPasswordDialog />} />
      <Route path={paths.verify_email} element={<EmailVerifyPage />} />
      <Route path="*" element={<Navigate to={paths.login} />} />
    </Routes >

  )
}

export default AppRoutes




