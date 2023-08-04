import Loader from 'react-loader-spinner'
import {Component} from 'react'
import {BsFillStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  intial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItem extends Component {
  state = {
    apiItemStatus: apiStatusConstants.intial,
    itemDetails: [],
  }

  componentDidMount() {
    this.getItemDetails()
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

  similarSnakeToCamel = item => ({
    companyLogoUrl: item.company_logo_url,
    employmentType: item.employment_type,
    companyWebsiteUrl: item.company_website_url,
    id: item.id,
    jobDescription: item.job_description,
    location: item.location,
    //  packagePerAnnum: item.package_per_annum,
    rating: item.rating,
    title: item.title,
  })

  lifeAtCompanySnakeToCamel = item => ({
    description: item.description,
    imageUrl: item.image_url,
  })

  skilssSnakeToCamel = item => ({
    name: item.name,
    imageUrl: item.image_url,
  })

  getItemDetails = async () => {
    this.setState({apiItemStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const token = Cookies.get('jwt_token')
    const {id} = params
    const itemDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(itemDetailsApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const modifiedData = {
        jobDetails: {
          ...this.snakeToCamel(data.job_details),
          skills: data.job_details.skills.map(item =>
            this.skilssSnakeToCamel(item),
          ),
          lifeAtCompany: this.lifeAtCompanySnakeToCamel(
            data.job_details.life_at_company,
          ),
        },
        similarJobs: data.similar_jobs.map(item =>
          this.similarSnakeToCamel(item),
        ),
      }
      this.setState({
        apiItemStatus: apiStatusConstants.success,
        itemDetails: modifiedData,
      })
    } else {
      this.setState({apiItemStatus: apiStatusConstants.failure})
    }
  }

  itemLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  itemFailureView = () => (
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

  similarJobItem = item => {
    const {
      companyLogoUrl,
      location,
      title,
      rating,
      employmentType,
      jobDescription,
    } = item
    return (
      <li className="similar-job-item-card-container">
        <div className="company-details">
          <div className="company-logo">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="inner-company-logo"
            />
          </div>
          <div className="title-rating-holder">
            <h2 className="title-heading">{title}</h2>
            <div className="flex-for-rating">
              <div>
                <BsFillStarFill className="star" />
              </div>
              <p className="rating-value">{rating}</p>
            </div>
          </div>
        </div>
        <h2 className="similar-description">Description</h2>
        <p>{jobDescription}</p>
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
      </li>
    )
  }

  itemSuccessView = () => {
    const {itemDetails} = this.state
    console.log(itemDetails)
    const {similarJobs, jobDetails} = itemDetails
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      lifeAtCompany,
      skills,
    } = jobDetails
    return (
      <>
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
          <div className="visit-container">
            <h3>Description</h3>
            <a className="visit-button" href={companyWebsiteUrl}>
              <p className="null-margin">Visit</p>
              <FaExternalLinkAlt />
            </a>
          </div>
          <p className="title-heading">{jobDescription}</p>
          <h1>Skills</h1>
          <ul className="skill-container">
            {skills.map(each => (
              <div className="each-skill-holder">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skill-pic"
                />
                <p>{each.name}</p>
              </div>
            ))}
          </ul>
          <h3>Life at Company</h3>
          <div className="life-at-company">
            <p>{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="krishna"
              className="lifeatpic"
            />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-job-ul">
          {similarJobs.map(each => this.similarJobItem(each))}
        </ul>
      </>
    )
  }

  renderView = () => {
    const {apiItemStatus} = this.state
    switch (apiItemStatus) {
      case apiStatusConstants.inProgress:
        return this.itemLoadingView()
      case apiStatusConstants.success:
        return this.itemSuccessView()
      default:
        return this.itemFailureView()
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container white">
          {this.renderView()}
        </div>
      </>
    )
  }
}
export default JobItem
