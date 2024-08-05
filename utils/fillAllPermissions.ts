type IPermission = {
    value: string,
    label: string
}
export type IMenu = {
    label: string,
    menues?: IMenu[],
    permissions: IPermission[]
}


export function FetchAllPermissions() {
    let permissions:IMenu[]=[];
    let productionMenu: IMenu = {
        label: 'Production',
        permissions: [{
            value: 'production_menu',
            label: 'Production Button'
        }],
        menues:[
            {
                label:'Production',
                permissions: [
                    {
                        value: 'production_view',
                        label: 'view'
                    },
                    {
                        value: 'production_create',
                        label: 'create'
                    },
                    {
                        value: 'production_edit',
                        label: 'edit'
                    },
                    {
                        value: 'production_delete',
                        label: 'delete'
                    },
                    {
                        value: 'production_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Article',
                permissions: [
                    {
                        value: 'article_view',
                        label: 'view'
                    },
                    {
                        value: 'article_create',
                        label: 'create'
                    },
                    {
                        value: 'article_edit',
                        label: 'edit'
                    },
                    {
                        value: 'article_delete',
                        label: 'delete'
                    },
                    {
                        value: 'article_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Machine',
                permissions: [
                    {
                        value: 'machine_view',
                        label: 'view'
                    },
                    {
                        value: 'machine_create',
                        label: 'create'
                    },
                    {
                        value: 'machine_edit',
                        label: 'edit'
                    },
                    {
                        value: 'machine_delete',
                        label: 'delete'
                    },
                    {
                        value: 'machine_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Machine Category',
                permissions: [
                    {
                        value: 'machine_category_view',
                        label: 'view'
                    },
                    {
                        value: 'machine_category_create',
                        label: 'create'
                    },
                    {
                        value: 'machine_category_edit',
                        label: 'edit'
                    },
                    {
                        value: 'machine_category_delete',
                        label: 'delete'
                    },
                    {
                        value: 'machine_category_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Dye',
                permissions: [
                    {
                        value: 'dye_view',
                        label: 'view'
                    },
                    {
                        value: 'dye_create',
                        label: 'create'
                    },
                    {
                        value: 'dye_edit',
                        label: 'edit'
                    },
                    {
                        value: 'dye_delete',
                        label: 'delete'
                    },
                    {
                        value: 'dye_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Shoe Weight',
                permissions: [
                    {
                        value: 'shoe_weight_view',
                        label: 'view'
                    },
                    {
                        value: 'shoe_weight_create',
                        label: 'create'
                    },
                    {
                        value: 'shoe_weight_edit',
                        label: 'edit'
                    },
                    {
                        value: 'shoe_weight_delete',
                        label: 'delete'
                    },
                    {
                        value: 'shoe_weight_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Dye Status',
                permissions: [
                    {
                        value: 'dye_status_view',
                        label: 'view'
                    },
                    {
                        value: 'dye_status_create',
                        label: 'create'
                    },
                    {
                        value: 'dye_status_edit',
                        label: 'edit'
                    },
                    {
                        value: 'dye_status_delete',
                        label: 'delete'
                    },
                    {
                        value: 'dye_status_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Dye Location',
                permissions: [
                    {
                        value: 'dye_location_view',
                        label: 'view'
                    },
                    {
                        value: 'dye_location_create',
                        label: 'create'
                    },
                    {
                        value: 'dye_location_edit',
                        label: 'edit'
                    },
                    {
                        value: 'dye_location_delete',
                        label: 'delete'
                    },
                    {
                        value: 'dye_location_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Shoe Weight Report',
                permissions: [
                    {
                        value: 'shoe_weight_report_view',
                        label: 'view'
                    },
                    {
                        value: 'shoe_weight_report_create',
                        label: 'create'
                    },
                    {
                        value: 'shoe_weight_report_edit',
                        label: 'edit'
                    },
                    {
                        value: 'shoe_weight_report_delete',
                        label: 'delete'
                    },
                    {
                        value: 'shoe_weight_report_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Machine Wise Production Report',
                permissions: [
                    {
                        value: 'machine_wise_production_report_view',
                        label: 'view'
                    },
                    {
                        value: 'machine_wise_production_report_create',
                        label: 'create'
                    },
                    {
                        value: 'machine_wise_production_report_edit',
                        label: 'edit'
                    },
                    {
                        value: 'machine_wise_production_report_delete',
                        label: 'delete'
                    },
                    {
                        value: 'machine_wise_production_report_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Thekedar Wise Production Report',
                permissions: [
                    {
                        value: 'thekedar_wise_production_report_view',
                        label: 'view'
                    },
                    {
                        value: 'thekedar_wise_production_report_create',
                        label: 'create'
                    },
                    {
                        value: 'thekedar_wise_production_report_edit',
                        label: 'edit'
                    },
                    {
                        value: 'thekedar_wise_production_report_delete',
                        label: 'delete'
                    },
                    {
                        value: 'thekedar_wise_production_report_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Machine category Wise Production Report',
                permissions: [
                    {
                        value: 'machine_category_wise_production_report_view',
                        label: 'view'
                    },
                    {
                        value: 'machine_category_wise_production_report_create',
                        label: 'create'
                    },
                    {
                        value: 'machine_category_wise_production_report_edit',
                        label: 'edit'
                    },
                    {
                        value: 'machine_category_wise_production_report_delete',
                        label: 'delete'
                    },
                    {
                        value: 'machine_category_wise_production_report_export',
                        label: 'export'
                    }
                ]
            },
           
        ]
    }
    let crmMenu: IMenu = {
        label: 'CRM',
        permissions: [{
            value: 'crm_menu',
            label: 'CRM Button'
        }],
        menues: [
            {
                label: 'Leads',
                permissions: [
                    {
                        value: 'leads_view',
                        label: 'view'
                    },
                    {
                        value: 'leads_create',
                        label: 'create'
                    },
                    {
                        value: 'leads_edit',
                        label: 'edit'
                    },
                    {
                        value: 'leads_delete',
                        label: 'delete'
                    },
                    {
                        value: 'leads_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Refers',
                permissions: [
                    {
                        value: 'refer_view',
                        label: 'view'
                    },
                    {
                        value: 'refer_create',
                        label: 'create'
                    },
                    {
                        value: 'refer_edit',
                        label: 'edit'
                    },
                    {
                        value: 'refer_delete',
                        label: 'delete'
                    },
                    {
                        value: 'refer_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Reminders',
                permissions: [
                    {
                        value: 'reminders_view',
                        label: 'view'
                    },
                    {
                        value: 'reminders_create',
                        label: 'create'
                    },
                    {
                        value: 'reminders_edit',
                        label: 'edit'
                    },
                    {
                        value: 'reminders_delete',
                        label: 'delete'
                    },
                    {
                        value: 'reminders_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Activities',
                permissions: [
                    {
                        value: 'activities_view',
                        label: 'view'
                    },
                    {
                        value: 'activities_create',
                        label: 'create'
                    },
                    {
                        value: 'activities_edit',
                        label: 'edit'
                    },
                    {
                        value: 'activities_delete',
                        label: 'delete'
                    },
                    {
                        value: 'activities_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'States',
                permissions: [
                    {
                        value: 'states_view',
                        label: 'view'
                    },
                    {
                        value: 'states_create',
                        label: 'create'
                    },
                    {
                        value: 'states_edit',
                        label: 'edit'
                    },
                    {
                        value: 'states_delete',
                        label: 'delete'
                    },
                    {
                        value: 'states_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Cities',
                permissions: [
                    {
                        value: 'city_view',
                        label: 'view'
                    },
                    {
                        value: 'city_create',
                        label: 'create'
                    },
                    {
                        value: 'city_edit',
                        label: 'edit'
                    },
                    {
                        value: 'city_delete',
                        label: 'delete'
                    },
                    {
                        value: 'city_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Lead Type',
                permissions: [
                    {
                        value: 'leadtype_view',
                        label: 'view'
                    },
                    {
                        value: 'leadtype_create',
                        label: 'create'
                    },
                    {
                        value: 'leadtype_edit',
                        label: 'edit'
                    },
                    {
                        value: 'leadtype_delete',
                        label: 'delete'
                    },
                    {
                        value: 'leadtype_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Lead Source',
                permissions: [
                    {
                        value: 'lead_source_view',
                        label: 'view'
                    },
                    {
                        value: 'lead_source_create',
                        label: 'create'
                    },
                    {
                        value: 'lead_source_edit',
                        label: 'edit'
                    },
                    {
                        value: 'lead_source_delete',
                        label: 'delete'
                    },
                    {
                        value: 'lead_source_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Lead Stage',
                permissions: [
                    {
                        value: 'leadstage_view',
                        label: 'view'
                    },
                    {
                        value: 'leadstage_create',
                        label: 'create'
                    },
                    {
                        value: 'leadstage_edit',
                        label: 'edit'
                    },
                    {
                        value: 'leadstage_delete',
                        label: 'delete'
                    },
                    {
                        value: 'leadstage_export',
                        label: 'export'
                    }
                ]
            }
        ]
    }
    let erpreportMenu: IMenu = {
        label: 'Erp Reports',
        permissions: [{
            value: 'erp_report_menu',
            label: 'ERP reports Button'
        }],
        menues: [
            {
                label: 'Pending Orders',
                permissions: [
                    {
                        value: 'pending_orders_view',
                        label: 'view'
                    },
                    {
                        value: 'pending_orders_create',
                        label: 'create'
                    },
                    {
                        value: 'pending_orders_edit',
                        label: 'edit'
                    },
                    {
                        value: 'pending_orders_delete',
                        label: 'delete'
                    },
                    {
                        value: 'pending_orders_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Bills Ageing Report',
                permissions: [
                    {
                        value: 'bills_ageing_view',
                        label: 'view'
                    },
                    {
                        value: 'bills_ageing_create',
                        label: 'create'
                    },
                    {
                        value: 'bills_ageing_edit',
                        label: 'edit'
                    },
                    {
                        value: 'bills_ageing_delete',
                        label: 'delete'
                    },
                    {
                        value: 'bills_ageing_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Client Sale Report',
                permissions: [
                    {
                        value: 'client_sale_report_view',
                        label: 'view'
                    },
                    {
                        value: 'client_sale_report_create',
                        label: 'create'
                    },
                    {
                        value: 'client_sale_report_edit',
                        label: 'edit'
                    },
                    {
                        value: 'client_sale_report_delete',
                        label: 'delete'
                    },
                    {
                        value: 'client_sale_report_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Last Year Client Sale Report',
                permissions: [
                    {
                        value: 'last_year_client_sale_report_view',
                        label: 'view'
                    },
                    {
                        value: 'last_year_client_sale_report_create',
                        label: 'create'
                    },
                    {
                        value: 'last_year_client_sale_report_edit',
                        label: 'edit'
                    },
                    {
                        value: 'last_year_client_sale_report_delete',
                        label: 'delete'
                    },
                    {
                        value: 'last_year_client_sale_report_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Party Target',
                permissions: [
                    {
                        value: 'party_target_view',
                        label: 'view'
                    },
                    {
                        value: 'party_target_create',
                        label: 'create'
                    },
                    {
                        value: 'party_target_edit',
                        label: 'edit'
                    },
                    {
                        value: 'party_target_delete',
                        label: 'delete'
                    },
                    {
                        value: 'party_target_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Sale Analysis',
                permissions: [
                    {
                        value: 'sale_analysis_view',
                        label: 'view'
                    },
                    {
                        value: 'sale_analysis_create',
                        label: 'create'
                    },
                    {
                        value: 'sale_analysis_edit',
                        label: 'edit'
                    },
                    {
                        value: 'sale_analysis_delete',
                        label: 'delete'
                    },
                    {
                        value: 'sale_analysis_export',
                        label: 'export'
                    }
                ]
            },
            {
                label: 'Erp States',
                permissions: [
                    {
                        value: 'erp_state_view',
                        label: 'view'
                    },
                    {
                        value: 'erp_state_create',
                        label: 'create'
                    },
                    {
                        value: 'erp_state_edit',
                        label: 'edit'
                    },
                    {
                        value: 'erp_state_delete',
                        label: 'delete'
                    },
                    {
                        value: 'erp_state_export',
                        label: 'export'
                    }
                ]
            }
        ]
    }
    
    permissions.push(productionMenu)
    permissions.push(crmMenu)
    permissions.push(erpreportMenu)
    return permissions;
}