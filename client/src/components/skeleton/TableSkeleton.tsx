import { Stack,Skeleton } from '@mui/material'

function TableSkeleton() {
    return (
        <Stack p={2} gap={2}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
        </Stack>
    )
}

export default TableSkeleton