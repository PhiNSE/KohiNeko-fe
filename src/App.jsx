import { lazy, Suspense } from 'react';
import '@splidejs/splide/dist/css/splide.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppLayout from './layout/app/AppLayout';
import Error from './components/Error';
import Loader from './components/Loader';
import Cat from './features/management/cat/Cat';
import Purchase from './features/purchase/Purchase';
import Items from './features/items/Items';
import Item from './features/management/items/Items';
import Booking from './features/booking/Booking';
import MyBooking from './features/booking/bookingHistory/MyBooking';
import ScrollToTop from './utils/ScrollToTop';
import UserProfile from './pages/guest/UserProfile';
// import ManagerLayout from './components/ManagerLayout';
import Staff from './features/management/staff/Staff';
import CoffeeShop from './features/management/coffeeShop/CoffeeShop';
import Dashboard from './features/management/dashboard/Dashboard';
import { ManagerProvider } from './features/management/ManagerContext';
import ManagerProfile from './features/management/ManagerProfile';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Packages from './features/management/coffeeShop/Packages';
import { WalletProvider } from './context/WalletProvider';
import MyBookingDetail from './features/booking/bookingHistory/MyBookingDetail';
import { Navigate } from 'react-router-dom';
import BookingPage from './features/staff/BookingPage';
import StaffBookingDetail from './features/staff/BookingDetail';
import Table from './features/management/tableType/Table';
import Area from './features/management/area/Area';
import ItemStaff from './features/itemsStaff/Items';
import AdminLayout from './layout/employee/admin/AdminLayout';
import Manager from './features/admin/manager/Manager';
import CatList from './features/staff/CatList';
import BookingManager from './features/management/booking/Booking';
import BookingDetail from './features/management/booking/BookingDetail';
import BookingDetailManager from './features/management/booking/BookingDetail';
// import StaffLayout from "./components/StaffLayout";

const Home = lazy(() => import('./pages/guest/Home'));
const Login = lazy(() => import('./features/authentication/Login'));
const Signup = lazy(() => import('./features/authentication/Signup'));
const Reservation = lazy(() => import('./pages/guest/Reservation'));
const About = lazy(() => import('./pages/guest/About'));
const Shop = lazy(() => import('./pages/guest/Shop'));
const ShopDetails = lazy(() => import('./pages/guest/ShopDetails'));
const More = lazy(() => import('./pages/guest/More'));
const Origin = lazy(() => import('./pages/guest/Origin'));
const Policy = lazy(() => import('./pages/guest/Policy'));
const HowItWorks = lazy(() => import('./pages/guest/HowItWorks'));
const BenefitsToCats = lazy(() => import('./pages/guest/BenefitsToCats'));
const StaffLayout = lazy(() =>
  import('../src/layout/employee/staff/StaffLayout')
);
const AdminCoffeeShop = lazy(() => import('./features/admin/CoffeeShop'));
const ManagerLayout = lazy(() =>
  import('./layout/employee/manager/ManagerLayout')
);
const Verification = lazy(() =>
  import('./features/authentication/Verification')
);
const ManagerSignup = lazy(() =>
  import('./features/authentication/ManagerSignup')
);
const ResetPassword = lazy(() =>
  import('./features/authentication/ResetPassword')
);
const ForgotPassword = lazy(() =>
  import('./features/authentication/ForgetPassword')
);
const ManagerBooking = lazy(() =>
  import('./features/management/booking/Booking')
);

//* Create  query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

//* Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#B96714', // replace with your primary color
    },
    secondary: {
      main: '#ff9933', // red color
    },
  },
  typography: {
    fontFamily: 'Afacad, Arial, sans-serif',
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AnimatePresence>
              <Suspense fallback={<Loader />}>
                <ScrollToTop />
                <ManagerProvider>
                  <Routes>
                    <Route element={<AppLayout />}>
                      <Route path='/' element={<Home />} />
                      <Route path='about' element={<About />}>
                        <Route path='origin' element={<Origin />} />
                        <Route path='policy' element={<Policy />} />
                        <Route path='howitworks' element={<HowItWorks />} />
                        <Route path='benefits' element={<BenefitsToCats />} />
                      </Route>
                      <Route path='/reservation' element={<Reservation />} />
                      <Route path='/coffeeShops' element={<Shop />} />
                      <Route
                        path='/coffeeShops/:shopId'
                        element={<ShopDetails />}
                      />
                      <Route
                        path='/coffeeShops/:coffeeShopId/booking'
                        element={<Booking />}
                      />
                      <Route path='/booking/history' element={<MyBooking />} />
                      <Route
                        path='/booking/history/:bookingId'
                        element={<MyBookingDetail />}
                      />
                      <Route
                        path='/coffeeShops/:coffeeShopId/items'
                        element={<Items />}
                      />
                      <Route path='/purchase' element={<Purchase />} />

                      <Route path='/more' element={<More />} />
                      <Route path='/profile' element={<UserProfile />} />
                    </Route>
                    <Route path='/reservation' element={<Reservation />} />
                    <Route path='/coffeeShops' element={<Shop />} />
                    <Route
                      path='/coffeeShops/:shopId'
                      element={<ShopDetails />}
                    />
                    <Route
                      path='/coffeeShops/:coffeeShopId/booking'
                      element={<Booking />}
                    />
                    <Route path='/booking/history' element={<MyBooking />} />
                    <Route
                      path='/coffeeShops/:coffeeShopId/items'
                      element={<Items />}
                    />
                    <Route path='/purchase' element={<Purchase />} />

                    <Route element={<ManagerLayout />}>
                      <Route
                        path='/management/dashboard'
                        element={<Dashboard />}
                      />
                      <Route path='/management/cat' element={<Cat />} />
                      <Route path='/management/items' element={<Item />} />
                      <Route path='/management/staffs' element={<Staff />} />
                      <Route
                        path='/management/coffeeShops'
                        element={<CoffeeShop />}
                      />
                      <Route
                        path='/management/profile'
                        A
                        element={<ManagerProfile />}
                      />
                    </Route>
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />

                    {/* Manager role  */}
                    <Route element={<ManagerLayout />}>
                      <Route
                        path='/management/dashboard'
                        element={<Dashboard />}
                      />
                      <Route
                        path='/management/coffeeShop/package'
                        element={<Packages />}
                      />
                      <Route path='/management/area' element={<Area />} />
                      <Route path='/management/cat' element={<Cat />} />
                      <Route path='/management/item' element={<Item />} />
                      <Route path='/management/staff' element={<Staff />} />
                      <Route path='/management/table' element={<Table />} />
                      <Route
                        path='/management/booking'
                        element={<BookingManager />}
                      />
                      <Route
                        path='/management/booking/:bookingId'
                        element={<BookingDetailManager />}
                      />
                      <Route
                        path='/management/coffeeShop'
                        element={<CoffeeShop />}
                      />
                      <Route
                        path='/management/profile'
                        element={<ManagerProfile />}
                      />
                      <Route
                        path='/management/booking'
                        element={<ManagerBooking />}
                      />
                    </Route>
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />

                    {/* Staff role */}
                    <Route path='staff' element={<StaffLayout />}>
                      <Route
                        index
                        element={<Navigate replace to='booking' />}
                      />
                      <Route
                        path='booking'
                        element={<BookingPage></BookingPage>}
                      />
                      <Route
                        path='booking/:bookingId'
                        element={<StaffBookingDetail />}
                      />
                      <Route
                        path='booking/:bookingId/items'
                        element={<ItemStaff />}
                      />
                    </Route>

                    {/* Admin role */}
                    <Route path='admin' element={<AdminLayout />}>
                      <Route index element={<Navigate replace to='' />} />
                      <Route path='coffeeshops' element={<AdminCoffeeShop />} />
                      <Route path='managers' element={<Manager />} />
                    </Route>

                    <Route path='/login' element={<Login />} />
                    <Route
                      path='/management/signup'
                      element={<ManagerSignup />}
                    />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/verification' element={<Verification />} />
                    {/* <Route path='/reset-password' element={<ResetPassword />} /> */}
                    <Route
                      path='/forgot-password'
                      element={<ForgotPassword />}
                    />
                    <Route
                      path='/reset-password/:token'
                      element={<ResetPassword />}
                    />

                    <Route path='*' element={<Error />} />
                  </Routes>
                </ManagerProvider>
              </Suspense>
            </AnimatePresence>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
