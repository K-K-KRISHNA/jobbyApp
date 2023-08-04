import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsFillStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import EmploymentGroup from '../EmploymentGroup'
import Header from '../Header'
import SalaryRange from '../SalaryRange'
import './index.css'

const apiStatusConstants = {
  intial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiProfileStatus: apiStatusConstants.intial,
    apiJobsStatus: apiStatusConstants.intial,
    profileDetails: [],
    employmentFilters: [],
    salaryFilters: [],
    searchInput: '',
    openingJobs: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getJobsList()
  }

  innerJobItemCard = item => {
    const {
      title,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      companyLogoUrl,
    } = item
    return (
      <Link to={`/jobs/${id}`} className="dehigliter">
        <div className="job-item-card-container">
          <div className="company-details">
            <div className="company-logo">
              <img
                src={companyLogoUrl}
                alt="company logo"
                className="inner-company-logo"
              />
            </div>
            <div className="title-rating-holder">
              <h1 className="title-heading">{title}</h1>
              <div className="flex-for-rating">
                <div>
                  <BsFillStarFill className="star" />
                </div>
                <p className="rating-value">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-package-holder">
            <div className="location">
              <div className="location-flex">
                <MdLocationOn className="location-icon" />
                <p>{location}</p>
              </div>
              <div className="location-flex">
                <BsFillBriefcaseFill className="location-icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <h3>Description</h3>
          <p className="description-heading">{jobDescription}</p>
        </div>
      </Link>
    )
  }

  snakeToCamel = item => ({
    companyLogoUrl: item.company_logo_url,
    employmentType: item.employment_type,
    id: item.id,
    jobDescription: item.job_description,
    location: item.location,
    packagePerAnnum: item.package_per_annum,
    rating: item.rating,
    title: item.title,
  })

  getJobsList = async () => {
    const token = Cookie.get('jwt_token')
    this.setState({apiJobsStatus: apiStatusConstants.inProgress})
    const {employmentFilters, salaryFilters, searchInput} = this.state
    const empolymentString = employmentFilters.join(',')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${empolymentString}&minimum_package=${salaryFilters}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.setState({
        openingJobs: data.jobs.map(item => this.snakeToCamel(item)),
        apiJobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiStatusConstants.failure})
    }
  }

  renderJobsLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <div className="loader-container">
      <button type="button" className="retry-btn">
        Retry
      </button>
    </div>
  )

  getProfile = async () => {
    const token = Cookie.get('jwt_token')
    this.setState({apiProfileStatus: apiStatusConstants.inProgress})
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = {
        profileImageUrl: data.profile_details.profile_image_url,
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        apiProfileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiProfileStatus: apiStatusConstants.failure})
    }
  }

  renderProfileLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <div className="loader-container">
      <button type="button" className="retry-btn">
        Retry
      </button>
    </div>
  )

  changeInJobs = empFilters => {
    this.setState({employmentFilters: empFilters}, this.getJobsList)
  }

  salaryChange = filter => {
    this.setState({salaryFilters: filter}, this.getJobsList)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  renderProfileSuccessView = () => {
    const {profileDetails, employmentFilters, salaryFilters} = this.state
    const {profileImageUrl, shortBio, name} = profileDetails
    return (
      <>
        <div className="profile-card">
          <img src={profileImageUrl} className="profile-icon" alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-bio">{shortBio}</p>
        </div>
        <EmploymentGroup changeInJobs={this.changeInJobs} />
        <SalaryRange salaryChange={this.salaryChange} />
      </>
    )
  }

  renderSuitableProfileView = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiStatusConstants.inProgress:
        return this.renderProfileLoadingView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return this.renderProfileSuccessView()
    }
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p className="gray">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn">
        Retry
      </button>
    </div>
  )

  renderJobsSuccessView = () => {
    const {openingJobs} = this.state
    return (
      <div>
        {openingJobs.length === 0 && (
          <div className="no-jobs-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="no-jobs-pic"
            />
            <h1>No Jobs Found</h1>
            <p className="gray">
              We could not find any jobs. Try other filters
            </p>
          </div>
        )}
        {openingJobs.map(each => this.innerJobItemCard(each))}
      </div>
    )
  }

  renderSuitableJobsView = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobsLoadingView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      default:
        return this.renderJobsSuccessView()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-holder">
          <div className="profile-filter-group">
            {this.renderSuitableProfileView()}
          </div>
          <div className="job-details-group">
            <div className="search-icon search-flexbox">
              <input
                type="search"
                className="search-bar"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                value={searchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.getJobsList}
              >
                <BsSearch className="search-icon magnifier" />
              </button>
            </div>
            {this.renderSuitableJobsView()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
