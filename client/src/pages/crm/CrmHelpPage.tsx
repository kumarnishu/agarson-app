import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function CrmHelpPage() {
  const data: { title: string, subtitle: string }[] = [
    { title: "Reminders", subtitle: "On This page we can See Reminders of last 7 days." },
    { title: "Activities", subtitle: "On This page we can See all Remarks (included reminders) added within 7 days." },
    { title: "Leads", subtitle: "On This page we can See all leads in tabular form" },
    { title: "Customers", subtitle: "On This page we can See Customers conveted from leads " },
    { title: "Useless", subtitle: "On This page we can See Leads conveted into useless " },
    { title: "Refer", subtitle: "On This page we can See all our parties that we have assigned leads in the past " },
    { title: "Fields", subtitle: "On This page we can manage editable fields on the leads " },
  ]
  return (
    <>
      {data.map((dt, index) => {
        return (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{dt.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {dt.subtitle}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </>
  )
}
