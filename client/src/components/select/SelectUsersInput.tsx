import { IUser } from '../../types/user.types'
import Select from 'react-select'


type Props = {
    users: IUser[], setIds: React.Dispatch<React.SetStateAction<string[]>>, isDisabled?: boolean, user: IUser
}

function SelectUsersInput({ users, setIds, user, isDisabled }: Props) {
    const options = users.map((user) => {
        return {
            value: user._id,
            label: user.username + ` | ` + user.email
        }
    })
    const defaultOptions = user.assigned_users.map((u) => {
        return {
            value: u._id,
            label: u.username + ` | ` + u.email
        }
    })
    return (
        <Select
            defaultValue={defaultOptions}
            className="single-select"
            classNamePrefix="select"
            isDisabled={isDisabled}
            isClearable={true}
            isSearchable={true}
            name="color"
            options={options}
            isMulti={true}
            onChange={(data) => setIds(data.map((dt) => { return dt?.value || "" }))}
        />
    )
}

export default SelectUsersInput

