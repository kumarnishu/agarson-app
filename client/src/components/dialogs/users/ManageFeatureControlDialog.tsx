import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material"
import { Cancel } from "@mui/icons-material"


function ManageFeatureControlDialog({ feature, setFeature }: { feature: string | undefined, setFeature: React.Dispatch<React.SetStateAction<string | undefined>> }) {
    return (
        <>
            <Dialog fullScreen open={feature ? true : false}
                onClose={() => setFeature(undefined)}
            >

                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setFeature(undefined)}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                    <Stack direction="row"
                        spacing={2}
                        alignItems={'center'}
                    >
                        <Typography variant="h6" p={1} sx={{textTransform:'uppercase',fontsize:18,fontWeight:'bold'}}>
                            {feature}
                        </Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>

                </DialogContent>

            </Dialog >
        </>
    )
}

export default ManageFeatureControlDialog
