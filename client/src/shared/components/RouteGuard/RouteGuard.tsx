import { Redirect, Route, RouteProps } from 'react-router-dom';

export type RouteGuardProps = RouteProps & {
  component: React.ComponentType;
  auth: boolean;
  redirect?: string;
};

const RouteGuard: React.FC<RouteGuardProps> = (props) => {
  const { component: Component, auth, redirect, ...rest } = props;

  console.log('Auth is: ', auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        auth === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={redirect ?? '/'} />
        )
      }
    />
  );
};

export default RouteGuard;
