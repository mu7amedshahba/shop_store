import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import "./index.css";
import NotFound from "./component/UI/Error/NotFoundPage";
import Footer from "./component/UI/website/footer/Footer";
import ErrorBoundary from "./component/UI/Error/ErrorBoundery";

// Navbar
const LazyNavBar = lazy(() => import("./component/UI/website/navbar/Navbar"));

// Pages
const LazyHero = lazy(() => import("./component/UI/website/HomePage/Hero"));
const LazyAbout = lazy(() => import("./component/UI/website/About/About"));
const LazySaleProducts = lazy(() =>
  import("./component/DashBoard_files/product__Files/ProductsPage")
);
const LazyAllProduct = lazy(() =>
  import("./component/UI/website/Products/AllProducts")
);

// Authentication
const RequireBack = lazy(() => import("./assets/Auth/RequireBack"));
const LazySignIn = lazy(() => import("./assets/Auth/Authentication/SignIn"));
const LazyRegister = lazy(() => import("./assets/Auth/Authentication/Register"));

// Jobs
const LazyFilteredJobs = lazy(() =>
  import("./component/UI/jobs__files/FilteredJobs")
);
const LazyJobsPage = lazy(() => import("./component/UI/JobsPage"));
const LazySinglePage = lazy(() =>
  import("./component/UI/jobs__files/SingleJob")
);

// Website main
const LazyWebSite = lazy(() => import("./component/UI/website/WebSite"));

// Dashboard
const LazyDashBoard = lazy(() =>
  import("./component/DashBoard_files/Dash__components/DashBoard")
);

// Users
const LazyUsersData = lazy(() =>
  import("./component/DashBoard_files/users__files/UsersData")
);
const LazyAddUser = lazy(() =>
  import("./component/DashBoard_files/users__files/AddUser")
);

// Categories
const LazyCategory = lazy(() =>
  import("./component/DashBoard_files/category__files/Category")
);
const LazyAddCategory = lazy(() =>
  import("./component/DashBoard_files/category__files/AddCategory")
);

// Products
const LazyProducts = lazy(() =>
  import("./component/DashBoard_files/product__Files/Products")
);

const LazyAddProduct = lazy(() =>
  import("./component/DashBoard_files/product__Files/AddProduct")
);
const LazyDashSetting = lazy(() =>
  import("./component/DashBoard_files/Dash__components/DashSetting")
);
const LazySingleProduct = lazy(() =>
  import("./component/DashBoard_files/product__Files/SingleProduct")
);

// const LazyCartPage = lazy(() => import("./component/UI/ReUsable/CartPage"));
// const LazyPaymentPage = lazy(() => import("./component/UI/ReUsable/PaymentPage"));
// const LazyOrderConfirmation = lazy(() => import("./component/UI/ReUsable/OrderConfirmation"));



function App() {
  return (
    <Router>
      <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyNavBar />
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<LazyWebSite />} />
          <Route path="/home" element={<LazyHero />} />
          <Route path="/about" element={<LazyAbout />} />
          <Route path="/sales-product" element={<LazySaleProducts />} />
          <Route path="products/:id" element={<LazySingleProduct />} />
          <Route path="/all-products" element={<LazyAllProduct />} />

          {/* Authentication */}
          <Route element={<RequireBack redirectTo={`/`} />}>
            <Route path="/sign-in" element={<LazySignIn />} />
            <Route path="/sign-up" element={<LazyRegister />} />
          </Route>

          {/* Jobs */}
          <Route path="/jobs_page" element={<LazyFilteredJobs />} />
          <Route path="/jobs" element={<LazyJobsPage />} />
          <Route path="/single_job" element={<LazySinglePage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<LazyDashBoard />}>
            <Route index element={<LazyUsersData />} />
            <Route path="users-data" element={<LazyUsersData />} />
            <Route path="add-user" element={<LazyAddUser />} />
            {/* Categories */}
            <Route path="category" element={<LazyCategory />} />
            <Route path="add-category" element={<LazyAddCategory />} />
            {/* Products */}
            <Route path="products" element={<LazyProducts />} />
            <Route path="add-product" element={<LazyAddProduct />} />
            {/* Settings */}
            <Route path="setting" element={<LazyDashSetting />} />
            {/* 404 for dashboard */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
           <Footer />
      </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
