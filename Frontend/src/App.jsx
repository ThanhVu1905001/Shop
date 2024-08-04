import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import MainLayout from "./pages/MainLayout.jsx";
import AddOrder from "./pages/Order/AddOrder.jsx";
import Order from "./pages/Order/Order.jsx";
import OrderDetail from "./pages/Order/OrderDetail.jsx";
import Customer from "./pages/Customer/Customer.jsx";
import CustomerDetail from "./pages/Customer/CustomerDetail.jsx";
import Product from "./pages/Product/Product.jsx";
import ProductDetail from "./pages/Product/ProductDetail.jsx";
import CustomerOrderDetail from "./pages/Customer/CustomerOrderDetail.jsx";
import User from "./pages/User/User.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";
import NotFound from "./pages/NotFound.jsx";
import AuthorRoute from "./routes/AuthorRoute.jsx";
import UpdateProduct from "./components/products/UpdateProduct.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/admin" element={<MainLayout />} exact>
              <Route index element={<Dashboard />} />
              <Route element={<AuthorRoute allowedRoles={["ROLE_ADMIN"]} />}>
                <Route path="users" element={<User />} />
              </Route>
              <Route
                element={
                  <AuthorRoute allowedRoles={["ROLE_ADMIN", "ROLE_SELLER"]} />
                }
              >
                <Route path="orders/create" element={<AddOrder />} />
                <Route path="orders" element={<Order />} />
                <Route path="orders/:id" element={<OrderDetail />} />
              </Route>
              <Route
                element={
                  <AuthorRoute
                    allowedRoles={["ROLE_ADMIN", "ROLE_CUSTOMERSERVICE"]}
                  />
                }
              >
                <Route path="customers" element={<Customer />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route
                  path="customers/:id/orders/:idOrder"
                  element={<CustomerOrderDetail />}
                />
              </Route>
              <Route
                element={
                  <AuthorRoute
                    allowedRoles={["ROLE_ADMIN", "ROLE_WAREHOUSESTAFF"]}
                  />
                }
              >
                <Route path="products" element={<Product />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="products/update" element={<UpdateProduct />} />
              </Route>
            </Route>
            <Route path="/not-found" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
