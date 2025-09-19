
import React from "react";
import BookManagement from "./BookManagement";
import BookReservation from "./BookReservation";
const BookPage = () => {
    const [activeStep, _setActiveStep] = React.useState(0);

    return (
        <>


            {activeStep === 0 && <BookManagement />}
            {activeStep === 1 && <BookReservation />}
        </>
    )
}
export default BookPage;