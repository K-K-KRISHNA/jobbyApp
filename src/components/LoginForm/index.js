import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookie from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    erroMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookie.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, erroMsg: errorMsg})
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <div className="holder">
        <label htmlFor="username" className="username-label">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="type-box"
          onChange={this.onChangeUsername}
          value={username}
        />
      </div>
    )
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <div className="holder">
        <label htmlFor="password" className="username-label">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="type-box"
          value={password}
          onChange={this.onChangePassword}
        />
      </div>
    )
  }

  renderLoginButton = () => (
    <button type="submit" className="login-btn">
      Login
    </button>
  )

  render() {
    const {erroMsg, showSubmitError} = this.state
    const token = Cookie.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <div className="logo-holder">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="icon-size"
            />
          </div>
          <div className="username-holder">{this.renderUsernameField()}</div>
          <div className="username-holder">{this.renderPasswordField()}</div>
          <div className="username-holder">{this.renderLoginButton()}</div>
          {showSubmitError && <p className="alert-msg">{`*${erroMsg}`}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
