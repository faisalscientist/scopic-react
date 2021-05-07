import './App.css';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Login from './pages/login';
import Authorized from './components/Authorized';
import AutoBidConfig from './pages/auto-bid-config';
import Home from './pages/home';
import ItemDetails from './pages/item-details';
import Visitor from './components/Visitor';

function App() {
  return (
    <Router>
      <Switch>
        <Visitor exact path="/login" component={Login} /> 
        <Authorized exact path="/">
          <Redirect to="/items" />
        </Authorized>
        <Authorized exact path="/autobid-configuration" component={AutoBidConfig} />
        <Authorized exact path="/items" component={Home} />
        <Authorized exact path="/items/:id" component={ItemDetails} />
        <Authorized exact path="/items/:id" component={ItemDetails} />
      </Switch>
    </Router>
  );
}

export default App;
