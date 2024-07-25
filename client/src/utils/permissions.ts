export const ProductionPermissions = {
   production: [
      {
         production_view: "production.view",
         production_create: "production.create",
         production_edit: "production.edit",
         production_delete: "production.delete",
         production_export: "production.export",
      }
   ],
   articles: [
      {
         article_view: "article.view",
         article_create: "article.create",
         article_edit: "article.edit",
         article_delete: "article.delete",
         article_export: "production.export",
      }
   ],
   machines: [
      {
         machine_view: "machine.view",
         machine_create: "machine.create",
         machine_edit: "machine.edit",
         machine_delete: "machine.delete",
         machine_export: "machine.export",
      }
   ],
   machine_categories: [
      {
         machine_category_view: "machine_category.view",
         machine_category_create: "machine_category.create",
         machine_category_edit: "machine_category.edit",
         machine_category_delete: "machine_category.delete",
         machine_category_export: "machine_category.export",
      }
   ],
   dyes: [
      {
         dye_view: "dye.view",
         dye_create: "dye.create",
         dye_edit: "dye.edit",
         dye_delete: "dye.delete",
         dye_export: "dye.export",
      }
   ],
   shoe_weights: [
      {
         shoe_weight_view: "shoe_weight.view",
         shoe_weight_create: "shoe_weight.create",
         shoe_weight_edit: "shoe_weight.edit",
         shoe_weight_delete: "shoe_weight.delete",
         shoe_weight_export: "shoe_weight.export",
      }
   ],
   shoe_weights_reports: [
      {
         shoe_weights_report_view: "shoe_weights_report.view",
         shoe_weights_report_create: "shoe_weights_report.create",
         shoe_weights_report_edit: "shoe_weights_report.edit",
         shoe_weights_report_delete: "shoe_weights_report.delete",
         shoe_weights_report_export: "shoe_weights_report.export",
      }
   ],
   machine_wise_production_reports: [
      {
         machine_wise_production_report_view: "machine_wise_production_report.view",
         machine_wise_production_report_create: "machine_wise_production_report.create",
         machine_wise_production_report_edit: "machine_wise_production_report.edit",
         machine_wise_production_report_delete: "machine_wise_production_report.delete",
         machine_wise_production_report_export: "machine_wise_production_report.export",
      }
   ],
   thekedar_wise_production_reports: [
      {
         thekedar_wise_production_report_view: "thekedar_wise_production_report.view",
         thekedar_wise_production_report_create: "thekedar_wise_production_report.create",
         thekedar_wise_production_report_edit: "thekedar_wise_production_report.edit",
         thekedar_wise_production_report_delete: "thekedar_wise_production_report.delete",
         thekedar_wise_production_report_export: "thekedar_wise_production_report.export",
      }
   ],
   machine_category_wise_production_reports: [
      {
         machine_category_wise_production_report_view: "machine_category_wise_production_report.view",
         machine_category_wise_production_report_create: "machine_category_wise_production_report.create",
         machine_category_wise_production_report_edit: "machine_category_wise_production_report.edit",
         machine_category_wise_production_report_delete: "machine_category_wise_production_report.delete",
         machine_category_wise_production_report_export: "machine_category_wise_production_report.export",
      }
   ]
}

export const CrmPermissions = {
   leads: [
      {
         lead_view: "lead.view",
         lead_create: "lead.create",
         lead_edit: "lead.edit",
         lead_delete: "lead.delete",
         lead_export: "lead.export",
      }
   ],
   refers: [
      {
         refer_view: "refer.view",
         refer_create: "refer.create",
         refer_edit: "refer.edit",
         refer_delete: "refer.delete",
         refer_export: "refer.export",
      }
   ],
   reminders: [
      {
         reminder_view: "reminder.view",
         reminder_create: "reminder.create",
         reminder_edit: "reminder.edit",
         reminder_delete: "reminder.delete",
         reminder_export: "reminder.export",
      }
   ],
   activities: [
      {
         activity_view: "activity.view",
         activity_create: "activity.create",
         activity_edit: "activity.edit",
         activity_delete: "activity.delete",
         activity_export: "activity.export",
      }
   ],
   crm_states: [
      {
         crm_state_view: "crm_state.view",
         crm_state_create: "crm_state.create",
         crm_state_edit: "crm_state.edit",
         crm_state_delete: "crm_state.delete",
         crm_state_export: "crm_state.export",
      }
   ],
   crm_cities: [
      {
         crm_city_view: "crm_city.view",
         crm_city_create: "crm_city.create",
         crm_city_edit: "crm_city.edit",
         crm_city_delete: "crm_city.delete",
         crm_city_export: "crm_city.export",
      }
   ],
   lead_types: [
      {
         lead_type_view: "lead_type.view",
         lead_type_create: "lead_type.create",
         lead_type_edit: "lead_type.edit",
         lead_type_delete: "lead_type.delete",
         lead_type_export: "lead_type.export",
      }
   ],
   lead_sources: [
      {
         lead_source_view: "lead_source.view",
         lead_source_create: "lead_source.create",
         lead_source_edit: "lead_source.edit",
         lead_source_delete: "lead_source.delete",
         lead_source_export: "lead_source.export",
      }
   ],
   lead_stages: [
      {
         lead_stage_view: "lead_stage.view",
         lead_stage_create: "lead_stage.create",
         lead_stage_edit: "lead_stage.edit",
         lead_stage_delete: "lead_stage.delete",
         lead_stage_export: "lead_stage.export",
      }
   ]
}
export const UserPermissions = {
   users: [
      {
         user_view: "user.view",
         user_create: "user.create",
         user_edit: "user.edit",
         user_export: "user.export",
      }
   ],
   permissions: [
      {
         permission_view: "permission.view",
         permission_create: "permission.create",
         permission_edit: "permission.edit",
         permission_delete: "permission.delete",
         permission_export: "permission.export",
      }
   ],
   roles: [
      {
         role_view: "role.view",
         role_create: "role.create",
         role_edit: "role.edit",
         role_delete: "role.delete",
         role_export: "role.export",
      }
   ],
}

export const ErpReportsPermissions = {
   pending_order_reports: [
      {
         pending_order_report_view: "pending_order_report.view",
         pending_order_report_create: "pending_order_report.create",
         pending_order_report_edit: "pending_order_report.edit",
         pending_order_report_export: "pending_order_report.export",
      }
   ],
   bills_ageing_reports: [
      {
         bills_ageing_report_view: "bills_ageing_report.view",
         bills_ageing_report_create: "bills_ageing_report.create",
         bills_ageing_report_edit: "bills_ageing_report.edit",
         bills_ageing_report_export: "bills_ageing_report.export",
      }
   ],
   client_sale_reports: [
      {
         client_sale_report_view: "client_sale_report.view",
         client_sale_report_create: "client_sale_report.create",
         client_sale_report_edit: "client_sale_report.edit",
         client_sale_report_export: "client_sale_report.export",
      }
   ],
   client_sale_lastyear_reports: [
      {
         client_sale_lastyear_report_view: "client_sale_lastyear_report.view",
         client_sale_lastyear_report_create: "client_sale_lastyear_report.create",
         client_sale_lastyear_report_edit: "client_sale_lastyear_report.edit",
         client_sale_lastyear_report_export: "client_sale_lastyear_report.export",
      }
   ],
   party_target_reports: [
      {
         party_target_report_view: "party_target_report.view",
         party_target_report_create: "party_target_report.create",
         party_target_report_edit: "party_target_report.edit",
         party_target_report_export: "party_target_report.export",
      }
   ],
   sale_analysis_reports: [
      {
         sale_analysis_report_view: "sale_analysis_report.view",
         sale_analysis_report_create: "sale_analysis_report.create",
         sale_analysis_report_edit: "sale_analysis_report.edit",
         sale_analysis_report_export: "sale_analysis_report.export",
      }
   ],
   erp_states: [
      {
         erp_state_view: "erp_state.view",
         erp_state_create: "erp_state.create",
         erp_state_edit: "erp_state.edit",
         erp_state_export: "erp_state.export",
      }
   ],
}

export const Permissions = [
   { ProductionPermissions: ProductionPermissions },
   { CrmPermissions: CrmPermissions },
   { UserPermissions: UserPermissions },
   { UserPermissions: UserPermissions },
   { ErpReportsPermissions: ErpReportsPermissions },
]