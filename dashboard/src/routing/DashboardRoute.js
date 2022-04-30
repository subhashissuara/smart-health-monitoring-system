import { Redirect, Route } from "react-router-dom";

const DashboardRoute = ({ component: Dashboard, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        localStorage.getItem("authToken") ? (
          <Dashboard {...routeProps} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default DashboardRoute;
