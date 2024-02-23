import { LinearProgress } from '@mui/material'
import React, { Suspense, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserContext } from './contexts/userContext'

import DashBoardNavBar from './components/navbar/DashBoardNavBar.tsx'
import MainDashBoardPage from './dashboards/MainDashBoardPage.tsx'
import CrmNavBar from './components/navbar/CrmNavBar.tsx'
import CrmDashboard from './dashboards/CrmDashboard.tsx'
import UsersNavBar from './components/navbar/UsersNavBar'
import UsersDashboard from './dashboards/UsersDashboard.tsx'
import ProductionNavBar from './components/navbar/ProductionNavBar.tsx'
import ProductionDashboard from './dashboards/ProductionDashboard.tsx'
import VisitNavBar from './components/navbar/MyVisitNavBar'
import VisitDashboard from './dashboards/VisitDashboard.tsx'
import TemplatesNavBar from './components/navbar/TemplatesNavBar'
import TemplatesDashboard from './dashboards/TemplatesDashboard.tsx'
import ChecklistDashboard from './dashboards/ChecklistDashboard.tsx'
import CheckListNavBar from './components/navbar/CheckListNavBar'
import PasswordNavbar from './components/navbar/ErpNavbar.tsx'
import BackupDashboard from './dashboards/BackupDashboard.tsx'
import ErpReportsDashboard from './dashboards/ErpReportsDashboard.tsx'
import TodoNavBar from './components/navbar/TodoNavbar.tsx'
import TodoDashboard from './dashboards/TodoDashboard.tsx'
const StatesPage = React.lazy(() => import('./pages/users/StatesPage.tsx'))
const PendingOrdersReportPage = React.lazy(() => import('./pages/erp reports/PendingOrdersReport.tsx'))
const ClientSaleReportPage = React.lazy(() => import('./pages/erp reports/ClientSaleReportsPage.tsx'))
const BillsAgingReportsPage = React.lazy(() => import('./pages/erp reports/BillsAgingReportPage.tsx'))
const TodoPage = React.lazy(() => import('./pages/todos/MyTodoPage.tsx'))
const TodosAdminPage = React.lazy(() => import('./pages/todos/TodosAdminPage.tsx'))
const TodoHelpPage = React.lazy(() => import('./pages/todos/TodoHelpPage.tsx'))

const LoginPage = React.lazy(() => import('./pages/users/LoginPage'))
const EmailVerifyPage = React.lazy(() => import('./pages/users/EmailVerifyPage'))
const UsersPage = React.lazy(() => import('./pages/users/UsersPage'))
const BackupPage = React.lazy(() => import('./pages/backup/BackupPage'))
const UseLessLeadsPage = React.lazy(() => import('./pages/crm/UseLessLeadsPage'))
const TemplatesPage = React.lazy(() => import('./pages/templates/TemplatesPage'))
const CrmHelpPage = React.lazy(() => import('./pages/crm/CrmHelpPage'))
const CrmReminderPage = React.lazy(() => import('./pages/crm/CrmReminderPage'))
const CheckListPage = React.lazy(() => import('./pages/checklists/CheckListPage'))
const CheckListAdminPage = React.lazy(() => import('./pages/checklists/CheckListAdminPage'))
const VisitingCardsPage = React.lazy(() => import('./pages/crm/VisitingCardsPage'))
const CheckListHelpPage = React.lazy(() => import('./pages/checklists/CheckListHelpPage'))
const MyVisitPage = React.lazy(() => import('./pages/visit/MyVisitPage'))
const VisitAdminPage = React.lazy(() => import('./pages/visit/VisitAdminPage'))
const UpdateTemplateCategoriesPage = React.lazy(() => import('./pages/templates/UpdateTemplateCategoriesPage.tsx'))
const AccessReportPage = React.lazy(() => import('./pages/users/FeatureWiseAccessReportPage.tsx'))
const ProductionAdminPage = React.lazy(() => import('./pages/production/ProductionAdminPage.tsx'))
const MachinesPage = React.lazy(() => import('./pages/production/MachinesPage.tsx'))
const DyesPage = React.lazy(() => import('./pages/production/DyesPage.tsx'))
const ArticlesPage = React.lazy(() => import('./pages/production/ArticlesPage.tsx'))
const ProductionHelpPage = React.lazy(() => import('./pages/production/ProductionHelpPage.tsx'))
const MyProductionPage = React.lazy(() => import('./pages/production/MyProductionPage.tsx'))
const VisitAttendencePage = React.lazy(() => import('./pages/visit/VisitAttendencePage.tsx'))
const UpdateMachineCategoriesPage = React.lazy(() => import('./pages/production/UpdateMachineCategoriesPage.tsx'))



// lazy loding
const ResetPasswordDialog = React.lazy(() => import('./components/dialogs/users/ResetPasswordDialog'))
const CustomersPage = React.lazy(() => import('./pages/crm/CustomersPage'))
const ReferralPartyPage = React.lazy(() => import('./pages/crm/ReferralPartyPage'))
const UpdateLeadFieldsPage = React.lazy(() => import('./pages/crm/UpdateLeadFieldsPage'))
const CrmActivitiesPage = React.lazy(() => import('./pages/crm/CrmActivitiesPage'))
const LeadsPage = React.lazy(() => import('./pages/crm/LeadsPage'))

export enum paths {
  //dashboards
  user_dashboard = "/user_dashboard",
  crm_dashboard = "/crm_dashboard",
  production_dashboard = "/production_dashboard",
  templates_dashboard = "/templates_dashboard",
  erp_dashboard = "/erp_dashboard",
  backup_dashboard = "/backup_dashboard",
  checklist_dashboard = "/checklist_dashboard",
  visit_dashboard = "/visit_dashboard",
  todo_dashboard = "/todo_dashboard",


  //help pages
  user_help_page = "user_help_page",
  crm_help_page = "crm_help_page",
  production_help_page = "production_help_page",
  templates_help_page = "templates_help_page",
  erp_login_help_page = "erp_login_help_page",
  backup_help_page = "backup_help_page",
  greetings_help_page = "greetings_help_page",
  checklist_help_page = "checklist_help_page",
  visits_help_page = "visits_help_page",
  todos_help_page = "todos_help_page",

  //visit
  visit = 'visit',
  visit_admin = 'visit_admin',
  visit_attendence = 'visit_attendence',

  //todo
  todo = 'todo',
  todo_admin = 'todo_admin',


  //erp reports
  pending_orders = "pending_orders",
  clients_sale ="clients_sale",
  bill_aging_report = "bill_aging_report",

  //checklists
  checklists = "checklists",
  checklist_admin_page = "checklist_admin_page",


  //crm
  crm = "crm",
  crm_reminders = "crm_reminders",
  crm_activities = "crm_activities",
  visiting_cards ="visiting_cards",
  leads = "leads",
  customers = "customers",
  updateble_fields_lead = "updateble_fields_lead",
  refers = "refers",
  useless_leads = "useless_leads",

  //production
  production = "production",
  machine_categories = "machine_categories",
  production_admin = "production_admin",
  machines = "machines",
  dyes = "dyes",
  articles = "articles",


 
  // greeting
  greetings = "greetings",


  // templates
  templates = "templates",
  template_categories = "template_categories",

  //users
  users = "users",
  feature_reports = "feature_reports",
  states = "states",
  login = "/",
  dashboard = "/",
  reset_password = "/password/reset/:token",
  verify_email = "/email/verify/:token",

  //backup
  backup_page = "backup_page",


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
                <MainDashBoardPage />
              }
            />
          </Route>
          {!user.user_access_fields.is_hidden &&
            < Route path={paths.user_dashboard} element={<UsersNavBar />}>
              <Route index
                element={
                  <UsersDashboard />
                }
              />
              <Route
                path={paths.user_dashboard} element={
                  <UsersDashboard />
                }
              />
              <Route
                path={paths.users} element={
                  <Suspense fallback={<LinearProgress />}><UsersPage /></Suspense>
                }
              />
              <Route
                path={paths.states} element={
                  <Suspense fallback={<LinearProgress />}><StatesPage /></Suspense>
                }
              />

              <Route
                path={paths.feature_reports} element={
                  <Suspense fallback={<LinearProgress />}><AccessReportPage /></Suspense>
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
                  <Suspense fallback={<LinearProgress />}> <MyProductionPage /></Suspense>
                }
              />
              <Route
                path={paths.machine_categories} element={
                  <Suspense fallback={<LinearProgress />}> <UpdateMachineCategoriesPage /></Suspense>
                }
              />
              <Route
                path={paths.production_admin} element={
                  <Suspense fallback={<LinearProgress />}> <ProductionAdminPage /></Suspense>
                }
              />

             
              <Route
                path={paths.production} element={
                  <Suspense fallback={<LinearProgress />}> <MyProductionPage /></Suspense>
                }
              />

              <Route
                path={paths.machines} element={
                  <Suspense fallback={<LinearProgress />}> <MachinesPage /></Suspense>
                }
              />
              <Route
                path={paths.dyes} element={
                  <Suspense fallback={<LinearProgress />}> <DyesPage /></Suspense>
                }
              />
              <Route
                path={paths.articles} element={
                  <Suspense fallback={<LinearProgress />}> <ArticlesPage /></Suspense>
                }
              />
              <Route
                path={paths.production_help_page} element={
                  <Suspense fallback={<LinearProgress />}> <ProductionHelpPage /></Suspense>
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
                  <Suspense fallback={<LinearProgress />}> <MyVisitPage /></Suspense>
                }
              />
              <Route
                path={paths.visit_attendence} element={
                  <Suspense fallback={<LinearProgress />}> <VisitAttendencePage /></Suspense>
                }
              />
              <Route
                path={paths.visit_admin} element={
                  <Suspense fallback={<LinearProgress />}> <VisitAdminPage /></Suspense>
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
              <Route path={paths.visiting_cards} element={
                <Suspense fallback={<LinearProgress />}><VisitingCardsPage /></Suspense>
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
                <Suspense fallback={<LinearProgress />}> < TemplatesPage /></Suspense>
              }
              />
              <Route path={paths.template_categories} element={
                <Suspense fallback={<LinearProgress />}> < UpdateTemplateCategoriesPage /></Suspense>
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
                <Suspense fallback={<LinearProgress />}>< CheckListPage /></Suspense>
              }
              />

              <Route
                path={paths.checklist_admin_page} element={
                  <Suspense fallback={<LinearProgress />}> <CheckListAdminPage /></Suspense>
                }
              />
              <Route
                path={paths.checklist_help_page} element={
                  <Suspense fallback={<LinearProgress />}><CheckListHelpPage /></Suspense>
                }
              />

            </Route>}
          {!user.todos_access_fields.is_hidden &&
            < Route path={paths.todo_dashboard} element={<TodoNavBar />
            }>
              <Route
                index element={
                  <TodoDashboard />
                }
              />
              <Route path={paths.todo_dashboard} element={
                < TodoDashboard />
              }
              />
              <Route path={paths.todo} element={
                <Suspense fallback={<LinearProgress />}>< TodoPage /></Suspense>
              }
              />

              <Route
                path={paths.todo_admin} element={
                  <Suspense fallback={<LinearProgress />}> <TodosAdminPage /></Suspense>
                }
              />
              <Route
                path={paths.todos_help_page} element={
                  <Suspense fallback={<LinearProgress />}><TodoHelpPage /></Suspense>
                }
              />

            </Route>}
          {!user.erp_access_fields.is_hidden &&
            < Route path={paths.erp_dashboard} element={<PasswordNavbar />
            }>
              <Route
                index element={
                  <ErpReportsDashboard />
                }
              />
              <Route path={paths.erp_dashboard} element={
                < ErpReportsDashboard />
              }
              />

              <Route path={paths.pending_orders} element={
                <Suspense fallback={<LinearProgress />}>
                  < PendingOrdersReportPage />
                </Suspense>
              }
              /> <Route path={paths.clients_sale} element={
                <Suspense fallback={<LinearProgress />}>
                  < ClientSaleReportPage />
                </Suspense>
              }
              />
              <Route path={paths.bill_aging_report} element={
                <Suspense fallback={<LinearProgress />}>
                  < BillsAgingReportsPage />
                </Suspense>

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
                  <Suspense fallback={<LinearProgress />}><BackupPage /></Suspense>
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




