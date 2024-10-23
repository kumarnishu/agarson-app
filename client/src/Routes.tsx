import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserContext } from './contexts/userContext'
import LoginPage from './pages/users/LoginPage.tsx'
import UsersPage from './pages/users/UsersPage.tsx'
import EmailVerifyPage from './pages/users/EmailVerifyPage.tsx'
import ResetPasswordDialog from './components/dialogs/users/ResetPasswordDialog.tsx'
import ReportDashboard from './dashboards/ReportsDashboard.tsx'
import DropDownDashboard from './dashboards/DropDownDashboard.tsx'
import MainDashBoardPage from './dashboards/MainDashBoardPage.tsx'
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
import UpdateMachineCategoriesPage from './pages/production/MachineCategoriesPage.tsx'
import ProductionAdminPage from './pages/production/ProductionPage.tsx'
import DyePage from './pages/production/DyesPage.tsx'
import ArticlePage from './pages/production/ArticlesPage.tsx'
import ErpStatesPage from './pages/erp reports/ErpStatesPage.tsx'
import PendingOrdersReport from './pages/erp reports/PendingOrdersReport.tsx'
import ClientSaleReportsPage from './pages/erp reports/ClientSaleReportsPage.tsx'
import ClientSaleLastYearReportsPage from './pages/erp reports/ClientSaleReportsPageLastyear.tsx'
import BillsAgingReportPage from './pages/erp reports/BillsAgingReportPage.tsx'
import LeadsPage from './pages/crm/LeadsPage.tsx'
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
import FeatureDashboard from './dashboards/FeatureDashboard.tsx'


function AppRoutes() {
  const { user } = useContext(UserContext)

  return (
    <Routes >
      {
        !user && <Route path="/Login" element={<LoginPage />} />}

     
      {
        user &&  <Route path="/"
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
            
          {user && user?.assigned_permissions.includes('feature_menu') &&
            < Route path="Features">
              <Route index
                element={
                  <FeatureDashboard />
                }
              />
              {user?.is_admin &&
                < Route path="Users" element={
                  <UsersPage />
                }>
                </Route>}
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
              <Route path="LeadsPage" element={
                <LeadsPage />
              }
              />
              <Route path="RefersPage" element={
                <RefersPage />
              }
              />
              <Route path="RemindersPage" element={
                < RemindersPage />
              }
              />
              <Route path="CheckListPage" element={
                < CheckListPage />
              }
              />
              <Route
                path="SoleThicknessPage" element={
                  <SoleThicknessPage />
                }
              />
            </Route>}

          {user && user?.assigned_permissions.includes('report_menu') &&
            < Route path="Reports">
              <Route index
                element={
                  <ReportDashboard />
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
              <Route path="CrmActivitiesPage" element={
                <CrmActivitiesPage />
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


          {user && user?.assigned_permissions.includes('dropdown_menu') &&
            < Route path="DropDown" >
              <Route index element={
                <DropDownDashboard />
              }
              />

              <Route
                path="UpdateMachineCategoriesPage" element={
                  <UpdateMachineCategoriesPage />
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
                path="ArticlePage" element={
                  <ArticlePage />
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
              <Route
                path="ErpStatesPage" element={
                  <ErpStatesPage />
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




