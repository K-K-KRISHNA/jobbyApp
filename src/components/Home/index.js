import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const navigate = () => {
    const {history} = props
    history.replace('/jobs/')
  }
  return (
    <>
      <Header />
      <div className="home-container">
        <h1 className="heading">Find The Job That Fits Your Life</h1>
        <p className="description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <button type="button" className="find-jobs-btn" onClick={navigate}>
          Find Jobs
        </button>
      </div>
    </>
  )
}
export default Home
