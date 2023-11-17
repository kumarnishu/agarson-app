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
import UsersHelpPage from './pages/users/UsersHelpPage'
import CrmHelpPage from './pages/crm/CrmHelpPage'
import BotHelpPage from './pages/bot/BotHelpPage'
import TemplatesHelpPage from './pages/templates/TemplatesHelpPage'
import BroadcastHelpPage from './pages/broadcast/BroadcastHelpPage'
import ContactHelpPage from './pages/contacts/ContactHelpPage'
import ReminderHelpPage from './pages/reminders/ReminderHelpPage'
import CrmReminderPage from './pages/crm/CrmReminderPage'
import CrmActivitiesPage from './pages/crm/CrmActivitiesPage'
import TasksPage from './pages/tasks/TasksPage'
import TaskHelpPage from './pages/tasks/TaskHelpPage'
import TaskNavBar from './components/navbar/TaskNavBar'
import TasksAdminPage from './pages/tasks/TasksAdminPage'
import CheckListPage from './pages/checklists/CheckListPage'
import CheckListAdminPage from './pages/checklists/CheckListAdminPage'
import CheckListHelpPage from './pages/checklists/CheckListHelpPage'
import CheckListNavBar from './components/navbar/CheckListNavBar'

// lazy loding
const ResetPasswordDialog = React.lazy(() => import('./components/dialogs/users/ResetPasswordDialog'))
const CustomersPage = React.lazy(() => import('./pages/crm/CustomersPage'))
const ReferralPartyPage = React.lazy(() => import('./pages/crm/ReferralPartyPage'))
const UpdateLeadFieldsPage = React.lazy(() => import('./pages/crm/UpdateLeadFieldsPage'))
const TrackersPage = React.lazy(() => import('./pages/bot/TrackersPage'))

export enum paths {

  //helppage
  crm_help = "help/crm",
  bot_help = "help/bot",
  broadcast_help = "help/broadcast",
  templates_help = "help/templates",
  reminder_help = "help/reminder",
  contact_help = "help/contact",
  users_help = "help/users",

  //task
  tasks = "/tasks",
  task_help_page = "task_help_page",
  task_admin_page = "task_admin_page",

  //checklists
  checklists = "/checklists",
  checklist_help_page = "checklist_help_page",
  checklist_admin_page = "checklist_admin_page",


  //crm
  crm = "/crm",
  crm_reminders = "crm_reminders",
  crm_activities = "crm_activities",
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
              <Route
                path={paths.users_help} element={
                  <UsersHelpPage />
                }
              />
            </Route>}
          {/* crm nav bar */}

          {!user.crm_access_fields.is_hidden &&
            < Route path={paths.crm} element={<CrmNavBar />
            }>
              <Route index element={
                <CrmReminderPage />
              }
              />
              <Route path={paths.leads} index element={
                <Suspense fallback={<LinearProgress />}><LeadsPage /></Suspense>
              }
              />
              <Route path={paths.crm_activities} element={
                <Suspense fallback={<LinearProgress />}><CrmActivitiesPage /></Suspense>
              }
              />
              <Route path={paths.crm_reminders} element={
                <Suspense fallback={<LinearProgress />}><CrmReminderPage /></Suspense>
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
              <Route
                path={paths.crm_help} element={
                  <CrmHelpPage />
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
              <Route
                path={paths.bot_help} element={
                  <BotHelpPage />
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
              <Route
                path={paths.templates_help} element={
                  <TemplatesHelpPage />
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
              <Route path={paths.broadcast} element={
                < BroadcastPage />
              }
              />
              <Route
                path={paths.broadcast_help} element={
                  <BroadcastHelpPage />
                }
              />

            </Route>}
          {/* task nav bar */}
          {!user.tasks_access_fields.is_hidden &&
            < Route path={paths.tasks} element={<TaskNavBar />
            }>
              <Route
                index element={
                  <TasksPage />
                }
              />

              <Route path={paths.tasks} element={
                < TasksPage />
              }
              />
              < Route
                path={paths.task_admin_page} element={
                  <TasksAdminPage />
                }
              />
              <Route
                path={paths.task_help_page} element={
                  <TaskHelpPage />
                }
              />

            </Route>}

          {/* checklist routes */}
          {!user.checklists_access_fields.is_hidden &&
            < Route path={paths.checklists} element={<CheckListNavBar />
            }>
              <Route
                index element={
                  <CheckListPage />
                }
              />

              <Route path={paths.checklists} element={
                < CheckListPage />
              }
              />

              <Route
                path={paths.checklist_admin_page} element={
                  <CheckListAdminPage />
                }
              />
              <Route
                path={paths.checklist_help_page} element={
                  <CheckListHelpPage />
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
              <Route path={paths.contacts} element={
                < ContactPage />
              }
              />
              <Route
                path={paths.contact_help} element={
                  <ContactHelpPage />
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
              <Route path={paths.reminders} element={
                < ReminderPage />
              }
              />
              <Route
                path={paths.reminder_help} element={
                  <ReminderHelpPage />
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
              <Route path={paths.alps} element={
                < AlpsPage />
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




