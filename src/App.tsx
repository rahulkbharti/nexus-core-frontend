import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import ThemeProvider from "./theme/ThemeProvider";
import FeesManagementSystem from "./pages/feePage/FeeManagement";
import RolePage from "./pages/rolePage/RolePage";
import UserPage from "./pages/userPage/UserPage";
import Exp from "./pages/experiments/Exp";
import LoginPage from "./pages/auth/loginPage/LoginPage";
import RegisterPage from "./pages/auth/registerPage/ResgisterPage";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store";
import ForgetPassword from "./pages/auth/forgetPasswordPage/forgetPage";
import { PersistGate } from "redux-persist/integration/react";
import BookPage from "./pages/bookPage/BookPage";
import BookCopy from "./pages/bookPage/BookCopy";
import SeatManagementSystem from "./pages/seatpage/SeatManagementSystem";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/" element={<Layout />}>
                <Route path="/users" element={<UserPage />} />
                <Route path="/roles" element={<RolePage />} />
                <Route path="/books" element={<BookPage />} />
                <Route path="/books/:bookId" element={<BookCopy />} />
                <Route path="/authors" element={<>ss</>} />
                <Route path="/fees" element={<FeesManagementSystem />} />
                <Route path="/seating" element={<SeatManagementSystem />} />
              </Route>
              <Route path="*" element={<Exp />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App;