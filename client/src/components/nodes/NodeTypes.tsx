import { Position } from "reactflow"
import CustomHandle from "./CustomHandle"
import { darkColor } from "../../utils/colors"
import { Stack, Typography } from "@mui/material"


export function StartNode({ data }: { data: any }) {
    return (
        <>
            <Stack sx={{ backgroundColor: darkColor, border: '5', borderColor: 'white', color: 'white', borderRadius: 2, p: 1 }}>
                {data.media_value || "type trigger keywords"}
            </Stack>
            <CustomHandle type="source" position={Position.Bottom} isConnectable={1} />
        </>
    )
}

export function CommonNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle type="target" position={Position.Top} isConnectable={2} />
            <Stack sx={{ backgroundColor: "#FFCCCB", border: 2, borderColor: 'black', borderRadius: 2, p: 1 }}>
                {data.media_value || "Common"}
            </Stack>
            <CustomHandle type="source" position={Position.Bottom} />
        </>
    )
}

export function MenuNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle type="target" position={Position.Top} />
            <Stack sx={{ backgroundColor: "lightblue", border: 2, borderColor: 'black', borderRadius: 2, p: 1 }}>
                {data.media_value || "Menu"}
            </Stack >
            <CustomHandle type="source" position={Position.Bottom} />
        </>
    )
}

export function DefaultNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle type="target" position={Position.Top} isConnectable={2} />
            <Stack sx={{ backgroundColor: "whitesmoke", border: 2, borderColor: 'black', borderRadius: 2, p: 1 }}>
                <Stack direction="row" justifyContent={"center"} alignItems={"center"} spacing={1}>
                    {
                        data.index ?
                            <Typography variant="button" sx={{ borderRadius: 5, p: 1, backgroundColor: 'lightskyblue' }}>
                                {data.index}
                            </Typography> : null

                    }
                    <Typography variant="subtitle1">
                        {data.media_value || "Default"}
                    </Typography>
                </Stack>

            </Stack>
            <CustomHandle type="source" position={Position.Bottom} />
        </>
    )
}

export function OutputNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle className=" bg-info border border-2 white" type="target" position={Position.Top} isConnectable={1} />
            <Stack sx={{ backgroundColor: "lightgreen", border: 2, borderColor: 'black', borderRadius: 2, p: 1 }}>
                <Stack direction="row" justifyContent={"center"} alignItems={"center"} spacing={1}>
                    {
                        data.index ?
                            <Typography variant="button" sx={{ borderRadius: 5, p: 1, backgroundColor: 'whitesmoke' }}>
                                {data.index}
                            </Typography> : null

                    }
                    <Typography variant="subtitle1">
                        {data.media_value || "Output"}
                    </Typography>
                </Stack>

            </Stack>
        </>
    )
}

