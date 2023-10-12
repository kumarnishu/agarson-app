import { Node } from "reactflow"
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import UpdateNodeForm from "../../forms/bot/UpdateNodeForm"
import { Cancel } from "@mui/icons-material"

type Props = {
    selectedNode: Node,
    displayNodeUpdateModal: boolean,
    updateNode: (index: number, media_value: string, media_type?: string) => void,
    setDisplayNodeUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
}
function UpdateNodeDialog({ updateNode, selectedNode, setDisplayNodeUpdateModal, displayNodeUpdateModal }: Props) {
    return (
        <Dialog open={displayNodeUpdateModal ? true : false}
            onClose={() => setDisplayNodeUpdateModal(false)}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setDisplayNodeUpdateModal(false)}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px', textAlign: 'center' }}>Update Node</DialogTitle>
            <DialogContent>
                {selectedNode ?
                    <UpdateNodeForm selectedNode={selectedNode} updateNode={updateNode} setDisplayNodeUpdateModal={setDisplayNodeUpdateModal} /> : null}
            </DialogContent>



        </Dialog>
    )
}

export default UpdateNodeDialog