import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Login from "./component/login";
import SignUp from "./component/signup";
import BackendURL from "./component/backendURL";
import Navbar from "./component/navbar";
import Footer from "./component/footer";
import HomeUser from "./component/homeUser";
import PasswordRecovery from "./component/passwordRecovery";
import RequestPasswordRecovery from "./component/requestPasswordRecovery.js";
import injectContext, { Context } from "./store/appContext";
import ScrollToTop from "../js/component/scrollToTop";
import Contacts from "./component/contacts.js";
import Groups from "./component/groups.js";
import CreateGroup from "./component/createGroup.js";
import Records from "./component/records.js";
import Payment from "./component/payment.js";
import ProductsInfo from "./component/products_info.js";
import IndividualPayment from "./component/individualPayment.js";
import GroupPayment from "./component/groupPayment.js";
import DetailsGroup from "./component/detailsGroup.js";
import Profile from "./component/profile.js";


const Layout = () => {
  const { actions } = useContext(Context);
  
  
  useEffect(() => {
    actions.checkAuthentication();
  }, []);
  
  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") {
    return <BackendURL />;
  }
  
  const basename = process.env.BASENAME || "";

    return (
        <BrowserRouter basename={basename}>
            <Content />
        </BrowserRouter>
    );
};

const Content = () => {
  const location = useLocation();
  const hideNavbarAndFooter = ["/*"];
  const shouldHideNavbarAndFooter = hideNavbarAndFooter.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbarAndFooter && <Navbar />}
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/homeUser" element={<HomeUser />} />
          <Route path="/individualPayment" element={<IndividualPayment />} />
          <Route path="/groupPayment" element={<GroupPayment />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/group" element={<Groups />} />
          <Route path="/group/:id" element={<DetailsGroup />} />
          <Route path="/createGroup" element={<CreateGroup />} />
          <Route path="/records" element={<Records />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/changepassword" element={<PasswordRecovery />} />
          <Route path="/requestpasswordrecovery" element={<RequestPasswordRecovery />} />
          <Route path="/payment" element={<Payment/>} />
          <Route path= "/productsInfo" element={<ProductsInfo/>}/>
        </Routes>
      </ScrollToTop>
      {!shouldHideNavbarAndFooter && <Footer />}
    </>
  );

};

export default injectContext(Layout);
