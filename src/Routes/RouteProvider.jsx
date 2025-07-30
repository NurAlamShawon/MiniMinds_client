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

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      { index: true, Component: Home },
      { path: "course-details", Component: CourseDetails },
      { path: "my-classes", Component: Myclasses },
      { path: "avater", Component: Avatar },
      { path: "Premium", Component: Premium },
      { path: "standings", Component: Standings },
      { path: "games", Component: Games },
      { path: "about", Component: About },
    ],
  },
]);

export default router;
