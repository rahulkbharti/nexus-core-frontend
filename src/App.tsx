import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import ThemeProvider from "./theme/ThemeProvider";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import NotificationManager from "./components/NotificationManager";
import ProtectedRoute from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import React, { Suspense } from "react";
import FullPageLoader from "./components/FullPageLoader";


const RolePage = React.lazy(() => import("./pages/rolePage/RolePage"));
const UserPage = React.lazy(() => import("./pages/userPage/UserPage"));
const Exp = React.lazy(() => import("./pages/experiments/Exp"));
const LoginPage = React.lazy(() => import("./pages/auth/loginPage/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/auth/registerPage/ResgisterPage"));
const ForgetPassword = React.lazy(() => import("./pages/auth/forgetPasswordPage/forgetPage"));
const BookPage = React.lazy(() => import("./pages/bookPage/BookPage"));
const BookCopy = React.lazy(() => import("./pages/bookPage/BookCopy"));
const SeatManagementSystem = React.lazy(() => import("./pages/seatpage/SeatManagementSystem"));
const FeePage = React.lazy(() => import("./pages/feePage/FeePage"));
const ErpFeedbackForm = React.lazy(() => import("./pages/feedback/FeedbackForm"));

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <BrowserRouter>
            <Suspense fallback={<FullPageLoader />}>
              <Routes>
                <Route path="/login" element={<PublicRoutes><LoginPage /></PublicRoutes>} />
                <Route path="/register" element={<PublicRoutes><RegisterPage /></PublicRoutes>} />
                <Route path="/forget-password" element={<PublicRoutes><ForgetPassword /></PublicRoutes>} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/" element={<UserPage />} />
                  <Route path="users" element={<UserPage />} />
                  <Route path="roles" element={<RolePage />} />
                  <Route path="books" element={<BookPage />} />
                  <Route path="books/:bookId" element={<BookCopy />} />
                  <Route path="authors" element={<>ss</>} />
                  <Route path="fees" element={<FeePage />} />
                  <Route path="seating" element={<SeatManagementSystem />} />
                  <Route path="/feedback" element={<ErpFeedbackForm />} />
                </Route>
                <Route path="*" element={<Exp />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <NotificationManager />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App;