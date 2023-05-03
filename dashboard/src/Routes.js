import { BrowserRouter, Switch, Route } from "react-router-dom";

// Routing
import DashboardRoute from "./routing/DashboardRoute";

// Screens
import Dashboard from "./components/Dashboard/Dashboard";
import LoginScreen from "./components/LoginScreen/LoginScreen";
// import RegisterScreen from "./components/RegisterScreen/RegisterScreen";

const Routes = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <DashboardRoute exact path="/" component={Dashboard} />
        <Route exact path="/login" component={LoginScreen} />
        {/* <Route exact path="/register" component={RegisterScreen} /> */}
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
