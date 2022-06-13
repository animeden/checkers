import './index.css'
import React from 'react'
import Home from './pages/home'
import Logreg from './pages/logreg'
import Settings from './pages/settings'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Rating from "./Components/rating";

function App() {

  return (
      <div className="main">
        <Router>
          <Switch>
              <Route path='/' exact component={Logreg}/>
              <Route path='/home' component={Home}/>
              <Route path='/settings' component={Settings}/>
          </Switch>
        </Router>
      </div>
  );
}

export default App;
