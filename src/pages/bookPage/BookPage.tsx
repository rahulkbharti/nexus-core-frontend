import { Step, StepButton, Stepper, Tab, Tabs, Typography } from "@mui/material"
import React from "react";
import BookManagement from "./BookManagement";
import BookReservation from "./BookReservation";
const BookPage = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>({});

    return (
        <>


            {activeStep === 0 && <BookManagement />}
            {activeStep === 1 && <BookReservation />}
        </>
    )
}
export default BookPage;