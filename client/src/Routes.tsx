import React, {  useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserContext } from './contexts/userContext'

import DashBoardNavBar from './components/navbar/DashBoardNavBar.tsx'
import MainDashBoardPage from './dashboards/MainDashBoardPage.tsx'
import CrmNavBar from './components/navbar/CrmNavBar.tsx'
import CrmDashboard from './dashboards/CrmDashboard.tsx'
import UsersNavBar from './components/navbar/UsersNavBar'
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
import LoginPage from './pages/users/LoginPage.tsx'
import UsersPage from './pages/users/UsersPage.tsx'
import UpdateMachineCategoriesPage from './pages/production/UpdateMachineCategoriesPage.tsx'
import ProductionAdminPage from './pages/production/ProductionAdminPage.tsx'
import DyePage from './pages/production/DyesPage.tsx'
import ArticlePage from './pages/production/ArticlesPage.tsx'
import ErpStatesPage from './pages/erp reports/StatesPage.tsx'
import PendingOrdersReport from './pages/erp reports/PendingOrdersReport.tsx'
import ClientSaleReportsPage from './pages/erp reports/ClientSaleReportsPage.tsx'
import ClientSaleLastYearReportsPage from './pages/erp reports/ClientSaleReportsPageLastyear.tsx'
import BillsAgingReportPage from './pages/erp reports/BillsAgingReportPage.tsx'
import MyVisitPage from './pages/visit/MyVisitPage.tsx'
import VisitAttendencePage from './pages/visit/VisitAttendencePage.tsx'
import VisitAdminPage from './pages/visit/VisitAdminPage.tsx'
import TemplatesPage from './pages/templates/TemplatesPage.tsx'
import UpdateTemplateCategoriesPage from './pages/templates/UpdateTemplateCategoriesPage.tsx.tsx'
import CheckListPage from './pages/checklists/CheckListPage.tsx'
import CheckListAdminPage from './pages/checklists/CheckListAdminPage.tsx'
import TodosPage from './pages/todos/MyTodoPage.tsx'
import TodosAdminPage from './pages/todos/TodosAdminPage.tsx'
import EmailVerifyPage from './pages/users/EmailVerifyPage.tsx'



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
                  <UsersPage />
                }
              />
              <Route
                path={paths.user_dashboard} element={
                  <UsersPage />
                }
              />
              <Route
                path={paths.users} element={
                  <UsersPage />
                }
              />
              
            </Route>}

          {user?.assigned_permissions && is_authorized('production_menu', user?.assigned_permissions) &&
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
                   <UpdateMachineCategoriesPage />
                }
              />
              <Route
                path={paths.production_admin} element={
                   <ProductionAdminPage />
                }
              />

        
              <Route
                path={paths.shoe_weight} element={
                   <ShoeWeightPage />
                }
              />
              <Route
                path={paths.machines} element={
                   <UpdateMachineCategoriesPage />
                }
              />
              <Route
                path={paths.dyes} element={
                   <DyePage />
                }
              />
              <Route
                path={paths.articles} element={
                   <ArticlePage />
                }
              />
            
            </Route>}
          {user?.assigned_permissions && is_authorized('erpreport_menu', user?.assigned_permissions) &&
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
                  <ErpStatesPage />
                }
              />
              <Route path={paths.pending_orders} element={
                
                  < PendingOrdersReport />
                
              }
              /> <Route path={paths.clients_sale} element={
                
                  < ClientSaleReportsPage />
                

              }
              />
              <Route path={paths.clients_sale_lastyear} element={
                
                  < ClientSaleLastYearReportsPage />
                

              }
              />
              <Route path={paths.bill_aging_report} element={
                
                  < BillsAgingReportPage />
                

              }
              />
              <Route path={paths.party_target} element={
                
                  < PartyTargetReportsPage />
                

              }
              />
              <Route path={paths.sale_analysis} element={
                
                  < SaleAnalysisReport />
                

              }
              />
            </Route>}

          {user?.assigned_permissions && is_authorized('crm_menu', user?.assigned_permissions) &&
            < Route path={paths.crm_dashboard} element={<CrmNavBar />
            }>
              <Route index element={
                <CrmDashboard />
              }
              />
              <Route path={paths.crm_dashboard} index element={
                <CrmDashboard />
              }
              />
              <Route path={paths.leads} index element={
                <LeadsPage />
              }
              />
              <Route path={paths.refers} index element={
                <RefersPage />
              }
              />
              <Route path={paths.crm_activities} index element={
                <CrmActivitiesPage />
              }
              />
              <Route path={paths.crm_reminders} index element={
                < RemindersPage />
              }
              />
              <Route path={paths.crm_cities} index element={
                <CitiesPage />
              }
              />
              <Route path={paths.crm_leadsources} index element={
                <CrmLeadSourcesPage />
              }
              />
              <Route path={paths.crm_stages} index element={
                <CrmStagesPage />
              }
              />
              <Route path={paths.crm_states} index element={
                <CrmStatesPage />
              }
              />
              <Route path={paths.crm_leadtypes} index element={
                <CrmTypesPage />
              }
              />

            </Route>}


          {user?.assigned_permissions && is_authorized('visits_menu', user?.assigned_permissions) &&
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

          {user?.assigned_permissions && is_authorized('template_menu', user?.assigned_permissions) &&
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

          {user?.assigned_permissions && is_authorized('checklists_menu', user?.assigned_permissions) &&
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
            

            </Route>}
          {user?.assigned_permissions && is_authorized('todo_menu', user?.assigned_permissions) &&
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
                < TodosPage />
              }
              />

              <Route
                path={paths.todo_admin} element={
                   <TodosAdminPage />
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




