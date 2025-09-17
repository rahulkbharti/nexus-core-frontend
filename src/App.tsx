import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import ThemeProvider from "./theme/ThemeProvider";
import FeesManagementSystem from "./pages/feePage/FeeManagement";
import BookManagementSystem from "./pages/bookPage/BookManagement";
import RolePage from "./pages/rolePage/RolePage";
import SeatManagementSystem from "./pages/seatpage/Seatmanagement";
import UserPage from "./pages/userPage/UserPage";
import Exp from "./pages/experiments/Exp";
import LoginPage from "./pages/auth/loginPage/LoginPage";
import RegisterPage from "./pages/auth/registerPage/ResgisterPage";
import { Provider } from "react-redux";
import store from "./store/store";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Layout />}>
              <Route path="/users" element={<UserPage />} />
              <Route path="/roles" element={<RolePage />} />
              <Route path="/books" element={<BookManagementSystem />} />
              <Route path="/authors" element={<>ss</>} />
              <Route path="/fees" element={<FeesManagementSystem />} />
              <Route path="/seating" element={<SeatManagementSystem />} />
            </Route>
            <Route path="*" element={<Exp />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App;