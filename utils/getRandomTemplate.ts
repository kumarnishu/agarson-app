import { IMessageTemplate } from "../types/template.types"

export function getRandomTemplate(templates: IMessageTemplate[]) {
    let new_templates: { id: number, template: IMessageTemplate }[] = templates.map((t, index) => {
        return { id: index + 1, template: t }
    })
    let template_length = new_templates.length
    let random_id = Math.floor(Math.random() * template_length) + 1
    let template = new_templates.find((t) => t.id === random_id)
    return template
}