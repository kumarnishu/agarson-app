export function is_authorized(val: string, permissions: string[]) {
    if (!permissions.includes(val))
        permissions.push(val)

    return permissions.includes(val)
}