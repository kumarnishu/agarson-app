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
    let [localSizes, setLocalSizes] = useState<{
        size: string;
        standard_weight: number;
        upper_weight: number;
    }[]>(sizes)
    const [size, setSize] = useState<string>()
    const [standard_weight, setStandardWeight] = useState<number>()
    const [upper_weight, setStandardUpperWeight] = useState<number>()

    useEffect(() => {
        if (sizes.length > 0)
            setLocalSizes(sizes)
    }, [sizes])

    console.log("sizes", localSizes)
    return (
        <>
            <Typography variant="button" fontSize={16} fontWeight={'bold'}>Add Article Sizes</Typography>
            <Stack flexDirection={'row'} gap={1}>
                <TextField
                    id="size"
                    value={size}
                    label="Article Size"
                    onChange={(e) => setSize(e.currentTarget.value)}
                />
                <TextField
                    id="st_weight"
                    type="number"
                    value={standard_weight}
                    label="Standard Weight"
                    onChange={(e) => setStandardWeight(Number(e.currentTarget.value))}
                />
                <TextField
                    id="upperWeight"
                    type="number"
                    value={upper_weight}
                    label="Standard Upper Weight"
                    onChange={(e) => setStandardUpperWeight(Number(e.currentTarget.value))}
                />
                <Button variant="contained" onClick={() => {
                    if (size && upper_weight && standard_weight) {
                        let tmps: {
                            size: string;
                            standard_weight: number;
                            upper_weight: number;
                        }[] = localSizes
                        tmps.push({ size: size, standard_weight: standard_weight, upper_weight: upper_weight })
                        setSizes(tmps)
                        setSize(undefined)
                        setStandardUpperWeight(undefined)
                        setStandardWeight(undefined)
                    }
                }}>Add</Button>
            </Stack>
            {localSizes && localSizes.map((size, index) => {
                return (
                    <Stack key={index} flexDirection={'column'} gap={1}>
                        <h4>size : {size.size}</h4>
                        <p>shoe standard weight : {size.standard_weight}</p>
                        <p>upper standard weight  : {size.upper_weight}</p>
                    </Stack>
                )
            })}
        </>
    )
}

export default CreateSizeInput