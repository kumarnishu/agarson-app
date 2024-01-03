import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

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


    const [size, setSize] = useState<string>()
    const [standard_weight, setStandardWeight] = useState<number>()
    const [upper_weight, setStandardUpperWeight] = useState<number>()


    return (
        <>
            <Typography variant="button" fontSize={16} fontWeight={'bold'}>Add Article Sizes</Typography>
            <Stack flexDirection={'row'} gap={1}>
                <TextField
                    focused
                    id="size"
                    label="Article Size"
                    onChange={(e) => setSize(e.currentTarget.value)}
                />
                <TextField
                    focused
                    id="st_weight"
                    type="number"
                    label="St. Weight"
                    onChange={(e) => setStandardWeight(Number(e.currentTarget.value))}
                />
                <TextField
                    focused
                    id="upperWeight"
                    type="number"
                    label="St. Upper Weight"
                    onChange={(e) => setStandardUpperWeight(Number(e.currentTarget.value))}
                />
                <Button variant="contained" onClick={() => {
                    if (size && upper_weight && standard_weight) {
                        let tmps: {
                            size: string;
                            standard_weight: number;
                            upper_weight: number;
                        }[] = sizes
                        tmps.push({ size: size, standard_weight: standard_weight, upper_weight: upper_weight })
                        setSizes(tmps)
                    }
                    setSize(undefined)
                    setStandardUpperWeight(undefined)
                    setStandardWeight(undefined)
                }}>Add</Button>
            </Stack>
            {sizes && sizes.map((size, index) => {
                return (
                    <Stack flexDirection={'row'} gap={1} key={index}>
                        <TextField
                            disabled
                            focused
                            id="size"
                            value={size.size}
                            label="Article Size"
                        />
                        <TextField
                            disabled
                            focused
                            id="st_weight"
                            type="number"
                            value={size.standard_weight}
                            label="St. Weight"
                        />
                        <TextField
                            disabled
                            focused
                            id="upperWeight"
                            type="number"
                            value={size.upper_weight}
                            label="St. Upper Weight"
                        />
                        <Button variant="contained" color="error" onClick={() => {
                            let tmps: {
                                size: string;
                                standard_weight: number;
                                upper_weight: number;
                            }[] = sizes
                            tmps = tmps.filter((tmp) => {
                                if (tmp.size !== size.size && tmp.standard_weight !== size.standard_weight && tmp.upper_weight !== size.upper_weight)
                                    return tmp
                            })
                            setSizes(tmps)
                        }}>Delete</Button>
                    </Stack >
                )
            })}
        </>
    )
}

export default CreateSizeInput