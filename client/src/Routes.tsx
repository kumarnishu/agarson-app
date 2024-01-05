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
import ReportsNavBar from './components/navbar/ReportsNavBar'
import MyVisitPage from './pages/visit/MyVisitPage'
import VisitHelpPage from './pages/visit/VisitHelpPage'
import VisitNavBar from './components/navbar/MyVisitNavBar'
import VisitAdminPage from './pages/visit/VisitAdminPage'
import TodosPage from './pages/todo/TodosPage'
import TodoHelpPage from './pages/todo/TodoHelpPage'
import TodosAdminPage from './pages/todo/TodosAdminPage'
import TodoNavBar from './components/navbar/TodoNavBar'
import ChatsPage from './pages/bot/ChatsPage'
import UpdateTemplateCategoriesPage from './pages/templates/UpdateTemplateCategoriesPage.tsx'
import GreetingsHelpPage from './pages/greetings/GreetingsHelpPage.tsx'
import GreetingsPage from './pages/greetings/GreetingsPage.tsx'
import GreetingsNavBar from './components/navbar/GreetingsNavBar.tsx'
import PasswordsPage from './pages/passwords/PasswordsPage.tsx'
import PasswordHelpPage from './pages/passwords/PasswordsHelpPage.tsx'
import PasswordsAdminPage from './pages/passwords/PasswordsAdminPage.tsx'
import PasswordNavbar from './components/navbar/PasswordNavbar.tsx'
import AccessReportPage from './pages/users/FeatureAccessReportPage.tsx'
import ProductionNavBar from './components/navbar/ProductionNavBar.tsx'
import ProductionAdminPage from './pages/production/ProductionAdminPage.tsx'
import RunningMouldPage from './pages/production/RunningMouldPage.tsx'
import DyeRepairPage from './pages/production/DyeRepairPage.tsx'
import MachinesPage from './pages/production/MachinesPage.tsx'
import DyesPage from './pages/production/DyesPage.tsx'
import ArticlesPage from './pages/production/ArticlesPage.tsx'
import ProductionHelpPage from './pages/production/ProductionHelpPage.tsx'
import ShoeWeightPage from './pages/production/ShoeWeightPage.tsx'
import MyProductionPage from './pages/production/MyProductionPage.tsx'
import MyShoeWeightPage from './pages/production/MyShoeWeightPage.tsx'
import MyDyeRepairPage from './pages/production/MyDyeRepairPage.tsx'
import MyRunningMouldPage from './pages/production/MyRunningMouldPage.tsx'
import VisitAttendencePage from './pages/visit/VisitAttendencePage.tsx'

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

  //visit
  visit = 'visit',
  visit_admin = 'visit_admin',
  visit_attendence = 'visit_attendence',
  visit_help = "visit_help",

  //task
  tasks = "/tasks",
  task_help_page = "task_help_page",
  task_admin_page = "task_admin_page",

  //todo
  todos = "/todos",
  todo_help_page = "todo_help_page",
  todo_admin_page = "todo_admin_page",

  //passwords
  passwords = "/passwords",
  password_help_page = "password_help_page",
  password_admin_page = "password_admin_page",

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

  //production
  production = "/production",
  production_admin = "production_admin",
  shoe_weight = "shoe_weight",
  dye_repair = "dye_repair",
  running_mould = "running_mould",
  my_shoe_weight = "my_shoe_weight",
  my_dye_repair = "my_dye_repair",
  my_running_mould = "my_running_mould",
  machines = "machines",
  dyes = "dyes",
  articles = "articles",
  production_help_page = "production_help_page",

  //bot
  bot = "/bot",
  chats = "chats",
  flows = "flows",
  trackers = "trackers",


  //reports
  reports = "/reports",
  leads_report = "leads_report",
  tour_reports = "tour_reports",

  //broadcast 
  broadcast = "/broadcast",

  // greeting
  greetings = "/greetings",
  greetings_help_page = "greetings_help_page",

  //reminders
  reminders = "reminders",

  //contacts
  contacts = "contacts",

  // templates
  templates = "templates",
  update_categories = "update_categories",

  //users
  users = "users",
  users_reports = "users_reports",
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
                path={paths.users_reports} element={
                  <AccessReportPage />
                }
              />
              <Route
                path={paths.users_help} element={
                  <UsersHelpPage />
                }
              />
            </Route>}
          {!user.todos_access_fields.is_hidden &&
            < Route path={paths.todos} element={<TodoNavBar />}>
              <Route index
                element={
                  <TodosPage />
                }
              />
              <Route
                path={paths.todos} element={
                  <TodosPage />
                }
              />
              <Route
                path={paths.todo_admin_page} element={
                  <TodosAdminPage />
                }
              />
              <Route
                path={paths.todo_help_page} element={
                  <TodoHelpPage />
                }
              />
            </Route>}
          {!user.productions_access_fields.is_hidden &&
            < Route path={paths.production} element={<ProductionNavBar />}>
              <Route index
                element={
                  <MyProductionPage />
                }
              />
              <Route
                path={paths.production} element={
                  <MyProductionPage />
                }
              />
              <Route
                path={paths.production_admin} element={
                  <ProductionAdminPage />
                }
              />
              <Route
                path={paths.running_mould} element={
                  <RunningMouldPage />
                }
              />
              <Route
                path={paths.dye_repair} element={
                  <DyeRepairPage />
                }
              />
              <Route
                path={paths.shoe_weight} element={
                  <ShoeWeightPage />
                }
              />
              <Route
                path={paths.production} element={
                  <MyProductionPage />
                }
              />
              <Route
                path={paths.my_running_mould} element={
                  <MyRunningMouldPage />
                }
              />
              <Route
                path={paths.my_dye_repair} element={
                  <MyDyeRepairPage />
                }
              />
              <Route
                path={paths.my_shoe_weight} element={
                  <MyShoeWeightPage />
                }
              />
              <Route
                path={paths.machines} element={
                  <MachinesPage />
                }
              />
              <Route
                path={paths.dyes} element={
                  <DyesPage />
                }
              />
              <Route
                path={paths.articles} element={
                  <ArticlesPage />
                }
              />
              <Route
                path={paths.production_help_page} element={
                  <ProductionHelpPage />
                }
              />
            </Route>}
          {!user.visit_access_fields.is_hidden &&
            < Route path={paths.visit} element={<VisitNavBar />}>
              <Route index
                element={
                  <MyVisitPage />
                }
              />
              <Route
                path={paths.visit} element={
                  <MyVisitPage />
                }
              />
              <Route
                path={paths.visit_attendence} element={
                  <VisitAttendencePage />
                }
              />
              <Route
                path={paths.visit_admin} element={
                  <VisitAdminPage />
                }
              />
              <Route
                path={paths.visit_help} element={
                  <VisitHelpPage />
                }
              />
            </Route>}

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
                path={paths.crm_help} element={
                  <CrmHelpPage />
                }
              />
            </Route>}
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
              <Route path={paths.chats} element={
                < ChatsPage />
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
              <Route path={paths.update_categories} element={
                < UpdateTemplateCategoriesPage />
              }
              />
              <Route
                path={paths.templates_help} element={
                  <TemplatesHelpPage />
                }
              />
            </Route>}

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

          {!user.reports_access_fields.is_hidden &&
            < Route path={paths.reports} element={<ReportsNavBar />
            }>
              <Route
                index element={
                  <VisitAdminPage />
                }
              />
              <Route path={paths.tour_reports} element={
                <VisitAdminPage />
              }
              />
              <Route path={paths.leads_report} element={
                < CrmActivitiesPage />
              }
              />
            </Route>}

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
          {!user.passwords_access_fields.is_hidden &&
            < Route path={paths.passwords} element={<PasswordNavbar />
            }>
              <Route
                index element={
                  <PasswordsPage />
                }
              />
              <Route path={paths.passwords} element={
                < PasswordsPage />
              }
              />
              <Route path={paths.password_admin_page} element={
                < PasswordsAdminPage />
              }
              />
              <Route
                path={paths.password_help_page} element={
                  <PasswordHelpPage />
                }
              />

            </Route>}
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
          {!user.greetings_access_fields.is_hidden &&
            < Route path={paths.greetings} element={<GreetingsNavBar />
            }>
              <Route
                index element={
                  <GreetingsPage />
                }
              />
              <Route path={paths.greetings} element={
                < GreetingsPage />
              }
              />
              <Route
                path={paths.greetings_help_page} element={
                  <GreetingsHelpPage />
                }
              />
            </Route>}

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




