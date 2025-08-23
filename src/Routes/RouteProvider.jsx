import { createBrowserRouter } from "react-router";
import HomeLayout from "../Layouts/HomeLayout";
import Home from "../Pages/Home";
import Avatar from "../Components/Avatar";
import CourseDetails from "../Components/CourseDetails";
import Myclasses from "../Components/Myclasses";
import Premium from "../Components/Premium";
import Standings from "../Components/Standings";
import Games from "../Components/Games";
import About from "../Components/About";
import AuthenticationLayout from "../Layouts/AuthenticationLayout";
import Login from "../Components/Login";
import Registration from "../Components/Registration";
import Dashboard from "../Components/Dashboard/Dashboard";
import DashBoardLayout from "../Layouts/DashBoardLayout";
import MyUsers from "../Components/Dashboard/MyUsers";
import AddLesson from "../Components/Dashboard/AddLesson";
import MakeAdmin from "../Components/Dashboard/MakeAdmin";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import GiftRedeem from "../Components/GiftRedeem";

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      { index: true, Component: Home },
      { path: "course-details", Component: CourseDetails },
      { path: "my-classes", element:<PrivateRoute><Myclasses/></PrivateRoute> },
      { path: "avater", element:<PrivateRoute><Avatar/></PrivateRoute> },
      { path: "Premium", Component: Premium },
      { path: "standings",element:<PrivateRoute><Standings/></PrivateRoute> },
      { path: "games", element:<PrivateRoute><Games/></PrivateRoute> },
      {path:"gift",element:<PrivateRoute><GiftRedeem/></PrivateRoute>},
      { path: "about", Component: About },
    ],
  },
  {
    path: "authentication",
    Component: AuthenticationLayout,
    children: [
      {
        index: true,
        Component: Login,
      },
      {
        path: "registration",
        Component: Registration,
      },
    ],
  },
  {
    path: "dashboard",
    element:<AdminRoute><Dashboard/></AdminRoute>,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      { path: "my-users", Component: MyUsers },
      { path: "add-lesson", Component: AddLesson },
      {
        path: "make-admin",
        Component: MakeAdmin,
      },
    ],
  },
]);

export default router;
