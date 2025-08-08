import { Button, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import { CopyToClipBoardValue } from '../../../../../../Common/CommonFunction';

const BarcodeModal = ({ open, onClose, barcodes }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Barcode List</DialogTitle>
      <DialogContent dividers>
        <List>
          {barcodes && barcodes?.length > 0 ? (
            barcodes.map((barcode, index) => (
              <ListItem key={index} secondaryAction={<CopyToClipBoardValue params={barcode} />}>
                <ListItemText primary={`${index + 1}). ${barcode}`} /> {/* Display index and barcode */}
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No barcodes available" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <Button onClick={onClose} style={{ margin: '10px' }}>
        Close
      </Button>
    </Dialog>
  );
};

export default BarcodeModal;
