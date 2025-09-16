import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import ThemeProvider from "./theme/ThemeProvider";

// import BookManagement from "./pages/BookManagement";
import FeesManagementSystem from "./pages/feePage/FeeManagement";
import BookManagementSystem from "./pages/bookPage/BookManagement";
// import UserPage from "./pages/userPage/UserPage";
import RolePage from "./pages/rolePage/RolePage";
import SeatManagementSystem from "./pages/seatpage/Seatmanagement";
import UserPage from "./pages/userPage/UserPage";
import Exp from "./pages/experiments/Exp";


const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/users" element={<UserPage />} />
            <Route path="/roles" element={<RolePage />} />
            <Route path="/books" element={<BookManagementSystem />} />
            <Route path="/authors" element={<>ss</>} />
            <Route path="/fees" element={<FeesManagementSystem />} />
            <Route path="/seating" element={<SeatManagementSystem />} />
            <Route path="*" element={<Exp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  )
}

export default App;