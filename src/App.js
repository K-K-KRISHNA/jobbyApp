import {Route, Switch} from 'react-router-dom'
import './App.css'
import LoginForm from './components/LoginForm'

import NotFound from './components/NotFound'
import Home from './components/Home'
import Jobs from './components/Jobs'
import ProtectedRoute from './components/ProtectedRoute'
import JobItem from './components/JobItem'
// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute
      exact
      path="/jobs"
      component={Jobs}
      employmentList={employmentTypesList}
    />
    <ProtectedRoute exact path="/jobs/:id" component={JobItem} />
    <ProtectedRoute component={NotFound} />
  </Switch>
)

export default App
