import React, { createContext, useState } from "react";
import { IUser } from "../types/user.types";

export enum Feature {
  users = "users",
  todos = "todos",
  tasks = "tasks",
  crm = "crm",
  checklists = "checklists",
  reports = "reports",
  visit = "visit",
  contacts = "contacts",
  bot = "bot",
  broadcast = "broadcast",
  reminders = "reminders",
  backup = "backup",
  alps = "alps",
  greetings = "greetings",
  templates = "templates",
  erp_login = "erp login",
}

// usercontext
type Context = {
  user: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
};
export const UserContext = createContext<Context>({
  user: undefined,
  setUser: () => null,
});


// user provider
export function UserProvider(props: { children: JSX.Element }) {
  const [user, setUser] = useState<IUser>();
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
}

