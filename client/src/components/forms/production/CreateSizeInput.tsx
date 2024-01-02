import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

function CreateSizeInput({ sizes, setSizes }: {
    sizes: {
        size: string;
        standard_weight: number;
        upper_weight: number;
    }[]
    , setSizes: React.Dispatch<React.SetStateAction<{
        size: string;
        standard_weight: number;
        upper_weight: number;
    }[]>>
}) {
    const [data, setData] = useState<{
        size: string;
        standard_weight: number;
        upper_weight: number;
    }[]>(sizes)
    const [size, setSize] = useState<string>()
    const [standard_weight, setStandardWeight] = useState<number>()
    const [upper_weight, setStandardUpperWeight] = useState<number>()

    useEffect(() => {
        setData(data)
    }, [data,setSizes])

    return (
        <>
            <Typography variant="button" fontSize={16} fontWeight={'bold'}>Add Article Sizes</Typography>
            <Stack flexDirection={'row'} gap={1}>
                <TextField
                    id="size"
                    label="Article Size"
                    onChange={(e) => setSize(e.currentTarget.value)}
                />
                <TextField
                    id="st_weight"
                    type="number"
                    label="Standard Weight"
                    onChange={(e) => setStandardWeight(Number(e.currentTarget.value))}
                />
                <TextField
                    id="upperWeight"
                    type="number"
                    label="Standard Upper Weight"
                    onChange={(e) => setStandardUpperWeight(Number(e.currentTarget.value))}
                />
                <Button variant="contained" onClick={() => {
                    if (size && upper_weight && standard_weight) {
                        let tmps: {
                            size: string;
                            standard_weight: number;
                            upper_weight: number;
                        }[] = data
                        tmps.push({ size: size, standard_weight: standard_weight, upper_weight: upper_weight })
                        setSizes(tmps)

                    }
                }}>Add</Button>
            </Stack>
            <Stack flexDirection={'column-reverse'} gap={1}>
                {data && data.map((dt, index) => {
                    return (
                        <React.Fragment key={index}>
                            <h3>{index + 1}</h3>
                            <h4>size : {dt.size}</h4>
                            <p>shoe standard weight : {dt.standard_weight}</p>
                            <p>upper standard weight  : {dt.upper_weight}</p>
                        </React.Fragment>
                    )
                })}
            </Stack>

        </>
    )
}

export default CreateSizeInput