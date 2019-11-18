import React, {useEffect, Suspense} from 'react';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index'


//lazy loading
const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
});

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});

//run only once when the component is mounted
const App = props => {
  const { onTryAutoSignIn } = props;
    useEffect(() => {
    onTryAutoSignIn();     
  }, [onTryAutoSignIn]);   
  
    let routes = (
      <Switch>
        <Route path="/auth" render={(props) => <Auth {...props}/>} />
        <Route path="/" exact component={BurgerBuilder} />      
        <Redirect to="/" />
      </Switch>
    );

    if(props.isAuthenticated) {
      routes =(
        <Switch>
          <Route path="/Checkout" render={(props) => <Checkout {...props}/>} />
          <Route path="/orders" render={(props) => <Orders {...props}/>} />
          <Route path="/logout" component={Logout} />
          <Route path="/auth" render={(props) => <Auth {...props}/>} />
          <Route path="/" exact component={BurgerBuilder} /> 
          <Redirect to="/" /> 
        </Switch>
      );
    }

    return (
      <div>
        <Layout> 
         <Suspense fallback={<p>Loading.....</p>}> {routes} </Suspense>
        </Layout>
      </div>
    );
  
};

const mapStateToProps = state => {
    return {
      isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignIn: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));