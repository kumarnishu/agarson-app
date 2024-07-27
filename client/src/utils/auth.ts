import { IRole } from "../types/user.types";

export function is_authorized(val: string, roles?: IRole[]) {
    let permissions: string[] = []
    roles && roles.map((role) => {
        role.permissions && role.permissions.forEach((perm) => {
            if (!permissions.includes(perm))
                permissions.push(perm)
        })
    })
    return permissions.includes(val)
}