import { AuthRoutes, AdminRoutes, PublicRoutes, SellerRoutes } from './routes/PageRoutes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import AuthLayout from './layouts/AuthLayout';
import PublicLayout from './layouts/PublicLayout';
import { UserProvider } from './store/UserContext'; 

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <AuthLayout>
                <AuthRoutes />
              </AuthLayout>
            }
          />
          <Route
            path="/public/*"
            element={
              <PublicLayout>
                <PublicRoutes />
              </PublicLayout>
            }
          />
          <Route
            path="/admin/*"
            element={<AdminRoutes />}
          />
          <Route
            path="/seller/*"
            element={<SellerRoutes />}
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
