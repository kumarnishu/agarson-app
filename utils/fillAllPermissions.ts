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
                        label: 'View Production'
                    },
                    {
                        value: 'production_create',
                        label: 'Create Production'
                    },
                    {
                        value: 'production_edit',
                        label: 'Edit Production'
                    },
                    {
                        value: 'production_delete',
                        label: 'Delete Production'
                    },
                    {
                        value: 'production_export',
                        label: 'Export Production'
                    }
                ]
            },
            {
                label: 'Article',
                permissions: [
                    {
                        value: 'article_view',
                        label: 'View Article'
                    },
                    {
                        value: 'article_create',
                        label: 'Create Article'
                    },
                    {
                        value: 'article_edit',
                        label: 'Edit Article'
                    },
                    {
                        value: 'article_delete',
                        label: 'Delete Article'
                    },
                    {
                        value: 'article_export',
                        label: 'Export Article'
                    }
                ]
            },
            {
                label: 'Machine',
                permissions: [
                    {
                        value: 'machine_view',
                        label: 'View Machine'
                    },
                    {
                        value: 'machine_create',
                        label: 'Create Machine'
                    },
                    {
                        value: 'machine_edit',
                        label: 'Edit Machine'
                    },
                    {
                        value: 'machine_delete',
                        label: 'Delete Machine'
                    },
                    {
                        value: 'machine_export',
                        label: 'Export Machine'
                    }
                ]
            },
            {
                label: 'Machine Category',
                permissions: [
                    {
                        value: 'machine_category_view',
                        label: 'View Machine Category'
                    },
                    {
                        value: 'machine_category_create',
                        label: 'Create Machine Category'
                    },
                    {
                        value: 'machine_category_edit',
                        label: 'Edit Machine Category'
                    },
                    {
                        value: 'machine_category_delete',
                        label: 'Delete Machine Category'
                    },
                    {
                        value: 'machine_category_export',
                        label: 'Export Machine Category'
                    }
                ]
            },
            {
                label: 'Dye',
                permissions: [
                    {
                        value: 'dye_view',
                        label: 'View Dye'
                    },
                    {
                        value: 'dye_create',
                        label: 'Create Dye'
                    },
                    {
                        value: 'dye_edit',
                        label: 'Edit Dye'
                    },
                    {
                        value: 'dye_delete',
                        label: 'Delete Dye'
                    },
                    {
                        value: 'dye_export',
                        label: 'Export Dye'
                    }
                ]
            },
            {
                label: 'Shoe Weight',
                permissions: [
                    {
                        value: 'shoe_weight_view',
                        label: 'View Machine'
                    },
                    {
                        value: 'shoe_weight_create',
                        label: 'Create Machine'
                    },
                    {
                        value: 'shoe_weight_edit',
                        label: 'Edit Machine'
                    },
                    {
                        value: 'shoe_weight_delete',
                        label: 'Delete Machine'
                    },
                    {
                        value: 'shoe_weight_export',
                        label: 'Export Machine'
                    }
                ]
            },
            {
                label: 'Report',
                permissions: [
                    {
                        value: 'production_report',
                        label: 'View Reports'
                    },
                ],
                menues:[
                    {
                        label: 'Shoe Weight Report',
                        permissions: [
                            {
                                value: 'shoe_weight_report_view',
                                label: 'View Shoe Weight Report'
                            },
                            {
                                value: 'shoe_weight_report_create',
                                label: 'Create Shoe Weight Report'
                            },
                            {
                                value: 'shoe_weight_report_edit',
                                label: 'Edit Shoe Weight Report'
                            },
                            {
                                value: 'shoe_weight_report_delete',
                                label: 'Delete Shoe Weight Report'
                            },
                            {
                                value: 'shoe_weight_report_export',
                                label: 'Export Shoe Weight Report'
                            }
                        ]
                    },
                    {
                        label: 'Machine Wise Production Report',
                        permissions: [
                            {
                                value: 'machine_wise_production_report_view',
                                label: 'View machine Wise Production Report'
                            },
                            {
                                value: 'machine_wise_production_report_create',
                                label: 'Create machine Wise Production Report'
                            },
                            {
                                value: 'machine_wise_production_report_edit',
                                label: 'Edit machine Wise Production Report'
                            },
                            {
                                value: 'machine_wise_production_report_delete',
                                label: 'Delete machine Wise Production Report'
                            },
                            {
                                value: 'machine_wise_production_report_export',
                                label: 'Export machine Wise Production Report'
                            }
                        ]
                    },
                    {
                        label: 'Thekedar Wise Production Report',
                        permissions: [
                            {
                                value: 'thekedar_wise_production_report_view',
                                label: 'View Thekedar Wise Production Report'
                            },
                            {
                                value: 'thekedar_wise_production_report_create',
                                label: 'Create Thekedar Wise Production Report'
                            },
                            {
                                value: 'thekedar_wise_production_report_edit',
                                label: 'Edit Thekedar Wise Production Report'
                            },
                            {
                                value: 'thekedar_wise_production_report_delete',
                                label: 'Delete Thekedar Wise Production Report'
                            },
                            {
                                value: 'thekedar_wise_production_report_export',
                                label: 'Export Thekedar Wise Production Report'
                            }
                        ]
                    },
                    {
                        label: 'Machine category Wise Production Report',
                        permissions: [
                            {
                                value: 'machine_category_wise_production_report_view',
                                label: 'View Machine Catgeory Wise Production Report'
                            },
                            {
                                value: 'machine_category_wise_production_report_create',
                                label: 'Create Machine Catgeory Wise Production Report'
                            },
                            {
                                value: 'machine_category_wise_production_report_edit',
                                label: 'Edit Machine Catgeory Wise Production Report'
                            },
                            {
                                value: 'machine_category_wise_production_report_delete',
                                label: 'Delete Machine Catgeory Wise Production Report'
                            },
                            {
                                value: 'machine_category_wise_production_report_export',
                                label: 'Export Machine Catgeory Wise Production Report'
                            }
                        ]
                    },
                ]
            },
        ]
    }
    permissions.push(productionMenu)
    return permissions;
}