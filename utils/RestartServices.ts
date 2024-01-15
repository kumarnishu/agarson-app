import { io } from "../app";
import { User } from "../models/users/user.model";
import {  createWhatsappClient } from "./CreateWhatsappClient";

export async function ReConnectWhatsapp() {
    let users = await User.find()
    users.forEach(async (user) => {
        if (io && user.connected_number) {
            await createWhatsappClient(user.client_id,io)
        }
    })
}






