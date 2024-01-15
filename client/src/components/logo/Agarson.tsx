import { Avatar } from "@mui/material"
import logo from "/logo.jpg";
import logo2 from "/logo.png";
import logo3 from "../../assets/logo_blue.png";

type Props = {
    width?: number,
    height?: number,
    title: string
}
function AgarsonLogo({ width, height, title }: Props) {
    return (

        <Avatar title={title}
            sx={{ width: width, height: height, borderRadius: 2 }}
            alt="img1" src={logo}
        />
    )
}

export function AgarsonPngLogo({ width, height, title }: Props) {
    return (

        <Avatar title={title}
            sx={{ width: width, height: height, borderRadius: 10 }}
            alt="img1" src={logo2}
        />
    )
}

export function BlueAgarsonLogo({ width, height, title }: Props) {
    return (

        <Avatar title={title}
            sx={{ width: width, height: height, borderRadius: 10 }}
            alt={title} src={logo3}
        />
    )
}


export default AgarsonLogo