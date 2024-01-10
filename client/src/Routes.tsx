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
import DashBoardPage from './dashboards/MainDashBoardPage.tsx'
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
import CrmHelpPage from './pages/crm/CrmHelpPage'
import BotHelpPage from './pages/bot/BotHelpPage'
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
import PasswordsAdminPage from './pages/passwords/PasswordsAdminPage.tsx'
import PasswordNavbar from './components/navbar/PasswordNavbar.tsx'
import AccessReportPage from './pages/users/FeatureWiseAccessReportPage.tsx'
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
import UpdateMachineCategoriesPage from './pages/production/UpdateMachineCategoriesPage.tsx'
import UsersDashboard from './dashboards/UsersDashboard.tsx'
import VisitDashboard from './dashboards/VisitDashboard.tsx'
import TodosDashboard from './dashboards/TodosDashboard.tsx'
import ProductionDashboard from './dashboards/ProductionDashboard.tsx'
import CrmDashboard from './dashboards/CrmDashboard.tsx'
import BotDashboard from './dashboards/BotDashboard.tsx'
import TemplatesDashboard from './dashboards/TemplatesDashboard.tsx'
import BroadcastDashboard from './dashboards/BroadcastDashboard.tsx'
import TasksDashboard from './dashboards/TasksDashboard.tsx'
import ChecklistDashboard from './dashboards/ChecklistDashboard.tsx'
import ContactsDashboard from './dashboards/ContactsDashboard.tsx'
import ErpLoginDashboard from './dashboards/ErpLoginDashboard.tsx'
import RemindersDashboard from './dashboards/RemindersDashboard.tsx'
import GreetingsDashboard from './dashboards/GreetingsDashboard.tsx'
import AlpsDashboard from './dashboards/AlpsDashboard.tsx'
import BackupDashboard from './dashboards/BackupDashboard.tsx'
import ReportsDashboard from './dashboards/ReportsDashboard.tsx'

// lazy loding
const ResetPasswordDialog = React.lazy(() => import('./components/dialogs/users/ResetPasswordDialog'))
const CustomersPage = React.lazy(() => import('./pages/crm/CustomersPage'))
const ReferralPartyPage = React.lazy(() => import('./pages/crm/ReferralPartyPage'))
const UpdateLeadFieldsPage = React.lazy(() => import('./pages/crm/UpdateLeadFieldsPage'))
const TrackersPage = React.lazy(() => import('./pages/bot/TrackersPage'))

export enum paths {

  //dashboards
  user_dashboard = "/user_dashboard",
  crm_dashboard = "/crm_dashboard",
  reports_dashboard = "/reports_dashboard",
  todo_dashboard = "/todo_dashboard",
  task_dashboard = "/task_dashboard",
  production_dashboard = "/production_dashboard",
  bot_dashboard = "/bot_dashboard",
  reminder_dashboard = "/reminder_dashboard",
  templates_dashboard = "/templates_dashboard",
  broadcast_dashboard = "/broadcast_dashboard",
  erp_login_dashboard = "/erp_login_dashboard",
  backup_dashboard = "/backup_dashboard",
  greetings_dashboard = "/greetings_dashboard",
  checklist_dashboard = "/checklist_dashboard",
  alps_dashboard = "/alps_dashboard",
  contacts_dashboard = "/contacts_dashboard",
  visit_dashboard = "/visit_dashboard",


  //help pages
  user_help_page = "user_help_page",
  crm_help_page = "crm_help_page",
  todo_help_page = "todo_help_page",
  task_help_page = "task_help_page",
  production_help_page = "production_help_page",
  bot_help_page = "bot_help_page",
  reminder_help_page = "reminder_help_page",
  templates_help_page = "templates_help_page",
  broadcast_help_page = "broadcast_help_page",
  erp_login_help_page = "erp_login_help_page",
  backup_help_page = "backup_help_page",
  greetings_help_page = "greetings_help_page",
  checklist_help_page = "checklist_help_page",
  alps_help_page = "alps_help_page",
  contacts_help_page = "contacts_help_page",
  visits_help_page = "visits_help_page",

  //visit
  visit = 'visit',
  visit_admin = 'visit_admin',
  visit_attendence = 'visit_attendence',

  //task
  tasks = "tasks",
  task_admin_page = "task_admin_page",

  //todo
  todos = "todos",
  todo_admin_page = "todo_admin_page",

  //passwords
  passwords = "passwords",
  password_admin_page = "password_admin_page",

  //checklists
  checklists = "checklists",
  checklist_admin_page = "checklist_admin_page",


  //crm
  crm = "crm",
  crm_reminders = "crm_reminders",
  crm_activities = "crm_activities",
  leads = "leads",
  customers = "customers",
  updateble_fields_lead = "updateble_fields_lead",
  refers = "refers",
  useless_leads = "useless_leads",

  //production
  production = "production",
  machine_categories ="machine_categories",
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

  //bot
  bot = "bot",
  chats = "chats",
  flows = "flows",
  trackers = "trackers",


  //reports
  reports = "reports",
  leads_report = "leads_report",
  tour_reports = "tour_reports",

  //broadcast 
  broadcast = "broadcast",

  // greeting
  greetings = "greetings",

  //reminders
  reminders = "reminders",

  //contacts
  contacts = "contacts",

  // templates
  templates = "templates",
  template_categories = "template_categories",

  //users
  users = "users",
  feature_reports = "feature_reports",
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
            < Route path={paths.user_dashboard} element={<UsersNavBar />}>
              <Route index
                element={
                  <UsersDashboard/>
                }
              />
              <Route
                path={paths.user_dashboard} element={
                  <UsersDashboard />
                }
              />
              <Route
                path={paths.users} element={
                  <UsersPage />
                }
              />

              <Route
                path={paths.feature_reports} element={
                  <AccessReportPage />
                }
              />
             
            </Route>}
          {!user.todos_access_fields.is_hidden &&
            < Route path={paths.todo_dashboard} element={<TodoNavBar />}>
              <Route index
                element={
                  <TodosDashboard />
                }
              />
              <Route
                path={paths.todo_dashboard} element={
                  <TodosDashboard />
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
            < Route path={paths.production_dashboard} element={<ProductionNavBar />}>
              <Route index
                element={
                  <ProductionDashboard />
                }
              />
              <Route
                path={paths.production_dashboard} element={
                  <ProductionDashboard />
                }
              />
              <Route
                path={paths.production} element={
                  <MyProductionPage />
                }
              />
              <Route
                path={paths.machine_categories} element={
                  <UpdateMachineCategoriesPage />
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
            < Route path={paths.visit_dashboard} element={<VisitNavBar />}>
              <Route index
                element={
                  <VisitDashboard />
                }
              />
              <Route
                path={paths.visit_dashboard} element={
                  <VisitDashboard />
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
             
            </Route>}

          {!user.crm_access_fields.is_hidden &&
            < Route path={paths.crm_dashboard} element={<CrmNavBar />
            }>
              <Route index element={
                <CrmDashboard />
              }
              />
              <Route path={paths.crm_dashboard} index element={
                <Suspense fallback={<LinearProgress />}><CrmDashboard /></Suspense>
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
                path={paths.crm_help_page} element={
                  <CrmHelpPage />
                }
              />
            </Route>}
          {!user.bot_access_fields.is_hidden &&
            < Route path={paths.bot_dashboard} element={<BotNavBar />
            }>
              <Route
                index element={
                  <BotDashboard />
                }
              />
              <Route path={paths.bot_dashboard} element={
                < BotDashboard />
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
                path={paths.bot_help_page} element={
                  <BotHelpPage />
                }
              />
            </Route>}

          {!user.templates_access_fields.is_hidden &&
            < Route path={paths.templates_dashboard} element={<TemplatesNavBar />
            }>

              <Route
                index element={
                  <TemplatesDashboard />
                }
              />
              <Route path={paths.templates_dashboard} element={
                < TemplatesDashboard />
              }
              />
              <Route path={paths.templates} element={
                < TemplatesPage />
              }
              />
              <Route path={paths.template_categories} element={
                < UpdateTemplateCategoriesPage />
              }
              />
             
            </Route>}

          {!user.broadcast_access_fields.is_hidden &&
            < Route path={paths.broadcast_dashboard} element={<BroadcastNavBar />
            }>
              <Route
                index element={
                  <BroadcastDashboard />
                }
              />
              <Route path={paths.broadcast_dashboard} element={
                < BroadcastDashboard />
              }
              />
              <Route path={paths.broadcast} element={
                < BroadcastPage />
              }
              />
             

            </Route>}
          {!user.tasks_access_fields.is_hidden &&
            < Route path={paths.task_dashboard} element={<TaskNavBar />
            }>
              <Route
                index element={
                  <TasksDashboard />
                }
              />
              <Route path={paths.task_dashboard} element={
                < TasksDashboard />
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
            < Route path={paths.checklist_dashboard} element={<CheckListNavBar />
            }>
              <Route
                index element={
                  <ChecklistDashboard />
                }
              />
              <Route path={paths.checklist_dashboard} element={
                < ChecklistDashboard />
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
            < Route path={paths.reports_dashboard} element={<ReportsNavBar />
            }>
              <Route
                index element={
                  <ReportsDashboard />
                }
              />
              <Route path={paths.reports_dashboard} element={
                <ReportsDashboard />
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
            < Route path={paths.contacts_dashboard} element={<ContactNavBar />
            }>
              <Route
                index element={
                  <ContactsDashboard />
                }
              />
              <Route path={paths.contacts_dashboard} element={
                < ContactsDashboard />
              }
              />
              <Route path={paths.contacts} element={
                < ContactPage />
              }
              />
            

            </Route>}
          {!user.passwords_access_fields.is_hidden &&
            < Route path={paths.erp_login_dashboard} element={<PasswordNavbar />
            }>
              <Route
                index element={
                  <ErpLoginDashboard />
                }
              />
              <Route path={paths.erp_login_dashboard} element={
                < ErpLoginDashboard />
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
            

            </Route>}
          {!user.reminders_access_fields.is_hidden &&
            < Route path={paths.reminder_dashboard} element={<ReminderNavBar />
            }>
              <Route
                index element={
                  <RemindersDashboard />
                }
              />
              <Route path={paths.reminder_dashboard} element={
                < RemindersDashboard />
              }
              />
              <Route path={paths.reminders} element={
                < ReminderPage />
              }
              />
             
            </Route>}
          {!user.greetings_access_fields.is_hidden &&
            < Route path={paths.greetings_dashboard} element={<GreetingsNavBar />
            }>
              <Route
                index element={
                  <GreetingsDashboard />
                }
              />
              <Route path={paths.greetings_dashboard} element={
                < GreetingsDashboard />
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
            < Route path={paths.alps_dashboard} element={<AlpsNavBar />
            }>
              <Route
                index element={
                  <AlpsPage />
                }
              />
              <Route path={paths.alps_dashboard} element={
                < AlpsDashboard />
              }
              />
              <Route path={paths.alps} element={
                < AlpsPage />
              }
              />
            </Route>}
          {!user.backup_access_fields.is_hidden &&
            <Route path={paths.backup_dashboard} element={<DashBoardNavBar />}>
              <Route index
                element={
                  <BackupDashboard />
                }
              />
              <Route
                path={paths.backup_dashboard} element={
                  <BackupDashboard />
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




