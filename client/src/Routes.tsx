import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserContext } from './contexts/userContext'
import MainDashBoardPage from './dashboards/MainDashBoardPage.tsx'
import CrmDashboard from './dashboards/CrmDashboard.tsx'
import ProductionDashboard from './dashboards/ProductionDashboard.tsx'
import ChecklistDashboard from './dashboards/ChecklistDashboard.tsx'
import ErpReportsDashboard from './dashboards/ErpReportsDashboard.tsx'
import RemindersPage from './pages/crm/CrmRemindersPage.tsx'
import CitiesPage from './pages/crm/CitiesPage.tsx'
import CrmStatesPage from './pages/crm/CrmStatesPage.tsx'
import RefersPage from './pages/crm/RefersPage.tsx'
import CrmLeadSourcesPage from './pages/crm/CrmSourcePage.tsx'
import CrmStagesPage from './pages/crm/CrmStagesPage.tsx'
import CrmTypesPage from './pages/crm/CrmleadTypesPage.tsx'
import CrmActivitiesPage from './pages/crm/CrmActivitiesReportPage.tsx'
import PartyTargetReportsPage from './pages/erp reports/PartyTargetReportPage.tsx'
import SaleAnalysisReport from './pages/erp reports/SaleAnalysisReport.tsx'
import ShoeWeightPage from './pages/production/ShoeWeightPage.tsx'
import LoginPage from './pages/users/LoginPage.tsx'
import UsersPage from './pages/users/UsersPage.tsx'
import UpdateMachineCategoriesPage from './pages/production/MachineCategoriesPage.tsx'
import ProductionAdminPage from './pages/production/ProductionPage.tsx'
import DyePage from './pages/production/DyesPage.tsx'
import ArticlePage from './pages/production/ArticlesPage.tsx'
import ErpStatesPage from './pages/erp reports/StatesPage.tsx'
import PendingOrdersReport from './pages/erp reports/PendingOrdersReport.tsx'
import ClientSaleReportsPage from './pages/erp reports/ClientSaleReportsPage.tsx'
import ClientSaleLastYearReportsPage from './pages/erp reports/ClientSaleReportsPageLastyear.tsx'
import BillsAgingReportPage from './pages/erp reports/BillsAgingReportPage.tsx'
import EmailVerifyPage from './pages/users/EmailVerifyPage.tsx'
import LeadsPage from './pages/crm/LeadsPage.tsx'
import ResetPasswordDialog from './components/dialogs/users/ResetPasswordDialog.tsx'
import MachinePage from './pages/production/MachinesPage.tsx'
import AssignedReferReportPage from './pages/crm/AssignedReferReportPage.tsx'
import NewReferReportPage from './pages/crm/NewReferReportPage.tsx'
import ShowWeightDifferenceReportPage from './pages/production/ShowWeightDifferenceReportPage.tsx'
import MachineWiseProductionReportPage from './pages/production/MachineWiseProductionReportPage.tsx'
import CategoryWiseProductionReportPage from './pages/production/CategoryWiseProductionReportPage.tsx'
import ThekedarWiseProductionReportPage from './pages/production/ThekedarWiseProductionReportPage.tsx'
import DyeStatusReportPage from './pages/production/DyeStatusReportPage.tsx'
import ChecklistCategoriesPage from './pages/checklists/CategoriesPage.tsx'
import CheckListPage from './pages/checklists/CheckListPage.tsx'
import SpareDyesPage from './pages/production/SpareDyesPage.tsx'
import SoleThicknessPage from './pages/production/SoleThicknessPage.tsx'
import DyeLocationPage from './pages/production/DyeLocationPage.tsx'



function AppRoutes() {
  const { user } = useContext(UserContext)

  return (
    <Routes >
      {
        !user && <Route path="/Login" element={<LoginPage />} />}
      {
        user && <Route path="/"
          element={
            <MainDashBoardPage />
          }>

          {user?.is_admin &&
            < Route path="Users">
              <Route index
                element={
                  <UsersPage />
                }
              />
            </Route>}

          {user?.assigned_permissions.includes('production_menu') &&
            < Route path="Production">
              <Route index
                element={
                  <ProductionDashboard />
                }
              />
              <Route
                path="UpdateMachineCategoriesPage" element={
                  <UpdateMachineCategoriesPage />
                }
              />
              <Route
                path="ProductionAdminPage" element={
                  <ProductionAdminPage />
                }
              />


              <Route
                path="ShoeWeightPage" element={
                  <ShoeWeightPage />
                }
              />
              <Route
                path="SpareDyesPage" element={
                  <SpareDyesPage />
                }
              />
              <Route
                path="DyeLocationsPage" element={
                  <DyeLocationPage />
                }
              />
              <Route
                path="MachinePage" element={
                  <MachinePage />
                }
              />
              <Route
                path="DyePage" element={
                  <DyePage />
                }
              />
              <Route
                path="SoleThicknessPage" element={
                  <SoleThicknessPage />
                }
              />
              
              <Route
                path="ArticlePage" element={
                  <ArticlePage />
                }
              />
              <Route
                path="ThekedarWiseProductionReportPage" element={
                  <ThekedarWiseProductionReportPage />
                }
              />
              <Route
                path="CategoryWiseProductionReportPage" element={
                  <CategoryWiseProductionReportPage />
                }
              />
              <Route
                path="MachineWiseProductionReportPage" element={
                  <MachineWiseProductionReportPage />
                }
              />
              <Route
                path="ShowWeightDifferenceReportPage" element={
                  <ShowWeightDifferenceReportPage />
                }
              />
              <Route
                path="DyeStatusReportPage" element={
                  <DyeStatusReportPage />
                }
              />
             
            </Route>}


          {user?.assigned_permissions.includes('crm_menu') &&
            < Route path="Crm" >
              <Route index element={
                <CrmDashboard />
              }
              />

              <Route path="LeadsPage" element={
                <LeadsPage />
              }
              />
              <Route path="RefersPage" element={
                <RefersPage />
              }
              />
              <Route path="CrmActivitiesPage" element={
                <CrmActivitiesPage />
              }
              />
              <Route path="RemindersPage" element={
                < RemindersPage />
              }
              />
              <Route path="CitiesPage" element={
                <CitiesPage />
              }
              />
              <Route path="LeadSourcesPage" element={
                <CrmLeadSourcesPage />
              }
              />
              <Route path="StagesPage" element={
                <CrmStagesPage />
              }
              />
              <Route path='CrmStatesPage' element={
                <CrmStatesPage />
              }
              />
              <Route path='LeadTypesPage' element={
                <CrmTypesPage />
              }
              />
              <Route path="AssignedReferReportPage" element={
                <AssignedReferReportPage />
              }
              />
              <Route path="NewReferReportPage" element={
                <NewReferReportPage />
              }
              />


            </Route>}

          {user?.assigned_permissions.includes('erp_report_menu') &&
            < Route path="ErpReports"
            >
              <Route
                index element={
                  <ErpReportsDashboard />
                }
              />

              <Route
                path="ErpStatesPage" element={
                  <ErpStatesPage />
                }
              />
              <Route path="PendingOrdersReport" element={

                < PendingOrdersReport />

              }
              /> <Route path="ClientSaleReportsPage" element={

                < ClientSaleReportsPage />


              }
              />
              <Route path="ClientSaleLastYearReportsPage" element={

                < ClientSaleLastYearReportsPage />


              }
              />
              <Route path="BillsAgingReportPage" element={

                < BillsAgingReportPage />


              }
              />
              <Route path="PartyTargetReportsPage" element={

                < PartyTargetReportsPage />


              }
              />
              <Route path="SaleAnalysisReport" element={

                < SaleAnalysisReport />


              }
              />
            </Route>}
          {
            < Route path="Checklist">
              <Route
                index element={
                  <ChecklistDashboard />
                }
              />

              <Route path="CheckListPage" element={
                < CheckListPage />
              }
              />

              <Route
                path="ChecklistCategoriesPage" element={
                  <ChecklistCategoriesPage />
                }
              />


            </Route>}
        </Route>
      }

      <Route path="/ResetPassword/:token" element={<ResetPasswordDialog />} />
      <Route path="/VerifyEmail/:token" element={<EmailVerifyPage />} />
      {user && <Route path="*" element={<Navigate to="/" />} />}
      <Route path="*" element={<Navigate to="/Login" />} />

    </Routes >

  )
}

export default AppRoutes




