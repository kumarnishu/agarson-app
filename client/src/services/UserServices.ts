import { AlpsAccess, BackupAccess, BotAccess, BroadcastAccess, CheckListsAccess, ContactsAccess, CrmAccess, GreetingAccess, RemindersAccess, TasksAccess, TemplatesAccess, TodoAccess, UserAccess } from "../types/access.types";
import { apiClient } from "./utils/AxiosInterceptor";

export type AccessTypes = {
  user_access_fields: UserAccess,
  crm_access_fields: CrmAccess,
  contacts_access_fields: ContactsAccess,
  templates_access_fields: TemplatesAccess,
  bot_access_fields: BotAccess,
  broadcast_access_fields: BroadcastAccess,
  backup_access_fields: BackupAccess,
  reminders_access_fields: RemindersAccess,
  alps_access_fields: AlpsAccess,
  tasks_access_fields: TasksAccess,
  checklists_access_fields: CheckListsAccess,
  reports_access_fields: CheckListsAccess,
  visit_access_fields: CheckListsAccess,
  todos_access_fields: TodoAccess
  greetings_access_fields: GreetingAccess

}
// login
export const Login = async (
  body: {
    username: string,
    password: string,
    multi_login_token?: string
  }
) => {
  return await apiClient.post("login", body);
};

// signup new organization and owner
export const Signup = async (body: FormData) => {
  return await apiClient.post("signup", body);
};
// new user
export const NewUser = async (body: FormData) => {
  return await apiClient.post("users", body);
};
// update user
export const UpdateUser = async ({ id, body }: { id: string, body: FormData }) => {
  return await apiClient.put(`users/${id}`, body);
};

// logout
export const Logout = async () => {
  return await apiClient.post("logout");
};
// get users

export const GetUsers = async () => {
  return await apiClient.get("users")
}
export const GetAllUsers = async () => {
  return await apiClient.get("users/all")
}

export const GetPaginatedUsers = async ({ limit, page }: { limit?: number | undefined, page?: number | undefined }) => {
  return await apiClient.get(`users/paginated/?limit=${limit}&page=${page}`)
}

export const FuzzySearchUsers = async ({ searchString, limit, page }: { searchString?: string, limit: number | undefined, page: number | undefined }) => {
  return await apiClient.get(`search/users?key=${searchString}&limit=${limit}&page=${page}`)
}

// get user
export const GetUser = async (id: string) => {
  return await apiClient.get(`users/${id}`)
}

// block user
export const BlockUser = async (id: string) => {
  return await apiClient.patch(`block/user/${id}`)
}
export const ResetMultiLogin = async (id: string) => {
  return await apiClient.patch(`allow/multi_login/${id}`)
}
export const BlockMultiLogin = async (id: string) => {
  return await apiClient.patch(`block/multi_login/${id}`)
}
// unblock user
export const UnBlockUser = async (id: string) => {
  return await apiClient.patch(`unblock/user/${id}`)
}
// make leads controlled


export const UpdateUserAccess = async ({ id, access_fields }: {
  id: string,
  access_fields: AccessTypes

}) => {
  return await apiClient.patch(`update/access/user/${id}`, access_fields)
}

// make admin
export const MakeAdmin = async (id: string) => {
  return await apiClient.patch(`make-admin/user/${id}`)
}
// revoke permissions of a admin 
export const RemoveAdmin = async (id: string) => {
  return await apiClient.patch(`remove-admin/user/${id}`)
}
// get profile
export const GetProfile = async () => {
  return await apiClient.get("profile");
};
// update profile
export const UpdateProfile = async (body: FormData) => {
  return await apiClient.put("profile", body);
};

// //update password
export const UpdatePassword = async (body: { oldPassword: string, newPassword: string, confirmPassword: string }) => {
  return await apiClient.patch("password/update", body)
};
export const UpdateUserPassword = async ({ id, body }: { id: string, body: { newPassword: string, confirmPassword: string } }) => {
  return await apiClient.patch(`password/reset/${id}`, body)
};
// //update password
export const ResetPassword = async ({ token, body }:
  {
    token: string,
    body: { newPassword: string, confirmPassword: string }
  }) => {
  return await apiClient.patch(`password/reset/${token}`, body)
};

// send reset password
export const ResetPasswordSendMail = async ({ email }:
  {
    email: string
  }) => {
  return await apiClient.post(`password/reset`, { email: email })
};

// verify email
export const VerifyEmail = async (token: string) => {
  return await apiClient.patch(`email/verify/${token}`)
};

// send verification main
export const SendVerifyEmail = async ({ email }:
  {
    email: string
  }) => {
  return await apiClient.post(`email/verify`, { email: email })
};
export const AssignUsers = async ({ id, body }: { id: string, body: { ids: string[] } }) => {
  return await apiClient.patch(`assign/users/${id}`, body)
}