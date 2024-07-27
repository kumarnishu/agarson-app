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
import ErpReportsDashboard from './dashboards/ErpReportsDashboard.tsx'
import TodoNavBar from './components/navbar/TodoNavbar.tsx'
import TodoDashboard from './dashboards/TodoDashboard.tsx'
import RemindersPage from './pages/crm/CrmRemindersPage.tsx'
import CitiesPage from './pages/crm/CitiesPage.tsx'
import CrmStatesPage from './pages/crm/CrmStatesPage.tsx'
import RefersPage from './pages/crm/RefersPage.tsx'
import CrmLeadSourcesPage from './pages/crm/CrmSourcePage.tsx'
import CrmStagesPage from './pages/crm/CrmStagesPage.tsx'
import CrmTypesPage from './pages/crm/CrmleadTypesPage.tsx'
import CrmActivitiesPage from './pages/crm/CrmActivitiesPage.tsx'
import PartyTargetReportsPage from './pages/erp reports/PartyTargetReportPage.tsx'
import SaleAnalysisReport from './pages/erp reports/SaleAnalysisReport.tsx'
import ShoeWeightPage from './pages/production/ShoeWeightPage.tsx'
import { is_authorized } from './utils/auth.ts'
const StatesPage = React.lazy(() => import('./pages/erp reports/StatesPage.tsx'))
const PendingOrdersReportPage = React.lazy(() => import('./pages/erp reports/PendingOrdersReport.tsx'))
const ClientSaleReportPage = React.lazy(() => import('./pages/erp reports/ClientSaleReportsPage.tsx'))
const ClientSaleReportsPageLastyear = React.lazy(() => import('./pages/erp reports/ClientSaleReportsPageLastyear.tsx'))
const BillsAgingReportsPage = React.lazy(() => import('./pages/erp reports/BillsAgingReportPage.tsx'))
const TodoPage = React.lazy(() => import('./pages/todos/MyTodoPage.tsx'))
const TodosAdminPage = React.lazy(() => import('./pages/todos/TodosAdminPage.tsx'))

const LoginPage = React.lazy(() => import('./pages/users/LoginPage'))
const EmailVerifyPage = React.lazy(() => import('./pages/users/EmailVerifyPage'))
const UsersPage = React.lazy(() => import('./pages/users/UsersPage'))
const TemplatesPage = React.lazy(() => import('./pages/templates/TemplatesPage'))
const CheckListPage = React.lazy(() => import('./pages/checklists/CheckListPage'))
const CheckListAdminPage = React.lazy(() => import('./pages/checklists/CheckListAdminPage'))
const MyVisitPage = React.lazy(() => import('./pages/visit/MyVisitPage'))
const VisitAdminPage = React.lazy(() => import('./pages/visit/VisitAdminPage'))
const UpdateTemplateCategoriesPage = React.lazy(() => import('./pages/templates/UpdateTemplateCategoriesPage.tsx'))
const ProductionAdminPage = React.lazy(() => import('./pages/production/ProductionAdminPage.tsx'))
const MachinesPage = React.lazy(() => import('./pages/production/MachinesPage.tsx'))
const DyesPage = React.lazy(() => import('./pages/production/DyesPage.tsx'))
const ArticlesPage = React.lazy(() => import('./pages/production/ArticlesPage.tsx'))
const VisitAttendencePage = React.lazy(() => import('./pages/visit/VisitAttendencePage.tsx'))
const UpdateMachineCategoriesPage = React.lazy(() => import('./pages/production/UpdateMachineCategoriesPage.tsx'))



// lazy loding
const ResetPasswordDialog = React.lazy(() => import('./components/dialogs/users/ResetPasswordDialog'))
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
  clients_sale = "clients_sale",
  clients_sale_lastyear = "clients_sale_lastyear",
  bill_aging_report = "bill_aging_report",
  sale_analysis ="sale_analysis",
  party_target ="party_target",

  //checklists
  checklists = "checklists",
  checklist_admin_page = "checklist_admin_page",


  //crm
  crm = "crm",
  crm_reminders = "crm_reminders",
  crm_activities = "crm_activities",
  crm_states = "crm_states",
  crm_cities = "crm_cities",
  crm_stages = "crm_stages",
  crm_leadtypes = "crm_leadtypes",
  crm_leadsources = "crm_leadsources",
  leads = "leads",
  refers = "refers",

  //production
  production = "production",
  machine_categories = "machine_categories",
  production_admin = "production_admin",
  machines = "machines",
  dyes = "dyes",
  articles = "articles",
  shoe_weight ="shoe_weight",


 
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
          {user?.is_admin &&
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
              
            </Route>}

          {user?.assigned_roles && is_authorized('production_menu', user?.assigned_roles) &&
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
                path={paths.shoe_weight} element={
                  <Suspense fallback={<LinearProgress />}> <ShoeWeightPage /></Suspense>
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
            
            </Route>}
          {user?.assigned_roles && is_authorized('erpreport_menu', user?.assigned_roles) &&
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
              <Route
                path={paths.states} element={
                  <Suspense fallback={<LinearProgress />}><StatesPage /></Suspense>
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
              <Route path={paths.clients_sale_lastyear} element={
                <Suspense fallback={<LinearProgress />}>
                  < ClientSaleReportsPageLastyear />
                </Suspense>

              }
              />
              <Route path={paths.bill_aging_report} element={
                <Suspense fallback={<LinearProgress />}>
                  < BillsAgingReportsPage />
                </Suspense>

              }
              />
              <Route path={paths.party_target} element={
                <Suspense fallback={<LinearProgress />}>
                  < PartyTargetReportsPage />
                </Suspense>

              }
              />
              <Route path={paths.sale_analysis} element={
                <Suspense fallback={<LinearProgress />}>
                  < SaleAnalysisReport />
                </Suspense>

              }
              />
            </Route>}

          {user?.assigned_roles && is_authorized('crm_menu', user?.assigned_roles) &&
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
              <Route path={paths.refers} index element={
                <Suspense fallback={<LinearProgress />}><RefersPage /></Suspense>
              }
              />
              <Route path={paths.crm_activities} index element={
                <Suspense fallback={<LinearProgress />}><CrmActivitiesPage /></Suspense>
              }
              />
              <Route path={paths.crm_reminders} index element={
                <Suspense fallback={<LinearProgress />}>< RemindersPage /></Suspense>
              }
              />
              <Route path={paths.crm_cities} index element={
                <Suspense fallback={<LinearProgress />}><CitiesPage /></Suspense>
              }
              />
              <Route path={paths.crm_leadsources} index element={
                <Suspense fallback={<LinearProgress />}><CrmLeadSourcesPage /></Suspense>
              }
              />
              <Route path={paths.crm_stages} index element={
                <Suspense fallback={<LinearProgress />}><CrmStagesPage /></Suspense>
              }
              />
              <Route path={paths.crm_states} index element={
                <Suspense fallback={<LinearProgress />}><CrmStatesPage /></Suspense>
              }
              />
              <Route path={paths.crm_leadtypes} index element={
                <Suspense fallback={<LinearProgress />}><CrmTypesPage /></Suspense>
              }
              />

            </Route>}


          {user?.assigned_roles && is_authorized('visits_menu', user?.assigned_roles) &&
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

          {user?.assigned_roles && is_authorized('template_menu', user?.assigned_roles) &&
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

          {user?.assigned_roles && is_authorized('checklists_menu', user?.assigned_roles) &&
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
            

            </Route>}
          {user?.assigned_roles && is_authorized('todo_menu', user?.assigned_roles) &&
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




