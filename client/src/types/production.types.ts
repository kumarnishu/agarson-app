import { GetUserDto } from "../dtos/users/user.dto";
import { Asset } from "./asset.types"


export type IDye = {
    _id: string,
    active: boolean,
    dye_number: number,
    size: string,
    articles: IArticle[],
    stdshoe_weight: number,
    created_at: Date,
    updated_at: Date,
    created_by: GetUserDto,
    updated_by: GetUserDto
}
interface IColumn {
    key: string;
    header: string,
    type:string
}

interface IRowData {
    [key: string]: string; // Type depends on your data
}

export interface IColumnRowData {
    columns: IColumn[];
    rows: IRowData[];
}

export interface ICategoryWiseProductionReport {
    date: string,
    total: number,
    verticalpluslympha: number,
    pu: number,
    gumboot: number
}

export type IShoeWeight = {
    _id: string,
    machine: IMachine,
    dye: IDye,
    article: IArticle,
    is_validated: boolean,
    month: number,
    shoe_weight1: number,
    shoe_photo1: Asset,
    weighttime1: Date,
    weighttime2: Date,
    weighttime3: Date,
    upper_weight1: number,
    upper_weight2: number,
    upper_weight3: number,
    shoe_weight2: number,
    shoe_photo2: Asset,
    shoe_weight3: number,
    shoe_photo3: Asset,
    created_at: Date,
    updated_at: Date,
    created_by: GetUserDto,
    updated_by: GetUserDto
}
export type IMachineCategory={
    _id: string,
    categories: string[],
    created_at: Date,
    updated_at: Date,
    created_by: GetUserDto,
    updated_by: GetUserDto
}
export type IMachine = {
    _id: string,
    name: string,
    active: boolean,
    serial_no:number
    category: string,
    display_name: string,
    created_at: Date,
    updated_at: Date,
    created_by: GetUserDto,
    updated_by: GetUserDto
}

export type IArticle = {
    _id: string,
    name: string,
    active: boolean,
    display_name: string,
    created_at: Date,
    updated_at: Date,
    created_by: GetUserDto,
    updated_by: GetUserDto
}
export type IDyeLocation = {
    _id: string,
    name: string,
    display_name: string,
    created_at: Date,
    updated_at: Date,
    created_by: GetUserDto,
    updated_by: GetUserDto
}

export type IDyeStatus = {
    _id: string,
    dye: IDye,
    article: IArticle,
    machine: IMachine,
    repair_required: boolean,
    dye_photo: Asset,
    photo_time: Date,
    location: IDyeLocation,
    created_at: Date,
    updated_at: Date,
    created_by: GetUserDto,
    updated_by: GetUserDto
}

export type IProduction = {
    _id: string,
    machine: IMachine,
    thekedar: GetUserDto,
    articles: IArticle[],
    manpower: number,
    production: number,
    big_repair: number,
    upper_damage: number,
    small_repair: number,
    date: Date,
    production_hours: number,
    created_at: Date,
    updated_at: Date,
    created_by: GetUserDto,
    updated_by: GetUserDto
}