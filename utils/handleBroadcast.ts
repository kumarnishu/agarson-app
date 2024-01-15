import { IBroadcast } from "../types/crm.types";

export async function handleBroadcast(broadcast: IBroadcast, clients: {
    client_id: string;
    client: any;
}[]) {
    console.log("no of clients", clients.length)
    clients.forEach(async (client) => {
        await client.client.sendMessage("917056943283@s.whatsapp.net", { text: 'oh hello there' })
    })
}