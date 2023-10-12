import { Socket, io } from 'socket.io-client';

let VITE_NODE_ENV = import.meta.env.VITE_NODE_ENV
let socket: Socket | undefined;

if (VITE_NODE_ENV === "development") {
    socket = io('http://localhost:5000')
}
else {
    socket = io()
}

export { socket }