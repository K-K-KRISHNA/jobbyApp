import './index.css'
import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookie from 'js-cookie'

const Header = props => {
  const onClickLogout = () => {
    Cookie.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="header-container">
      <div className="mobile-view-header-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="mobile-website-logo"
          />
        </Link>
        <div className="mobile-icon-container">
          <Link to="/">
            <AiFillHome className="white-color" />
          </Link>
          <Link to="/jobs">
            <BsFillBriefcaseFill className="white-color" />
          </Link>
          <button type="button" onClick={onClickLogout}>
            <FiLogOut className="white-color" />
          </button>
        </div>
      </div>
      <div className="desktop-view-header-container">
        <div>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logo-desktop"
            />
          </Link>
        </div>
        <div className="home-jobs-container">
          <div>
            <Link to="/" className="de-underline">
              Home
            </Link>
          </div>
          <div>
            <Link to="/jobs" className="de-underline">
              Jobs
            </Link>
          </div>
        </div>
        <button type="button" className="logout-btn" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
