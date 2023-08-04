import {Component} from 'react'
import './index.css'

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

class EmploymentGroup extends Component {
  state = {
    employmentList: [],
  }

  overtoJobs = () => {
    const {changeInJobs} = this.props
    const {employmentList} = this.state
    changeInJobs(employmentList)
  }

  handlefiltering = event => {
    const {value, checked} = event.target
    const {employmentList} = this.state
    let updatedList = employmentList
    if (checked) {
      updatedList = [...employmentList, value]
    } else if (!checked && employmentList.includes(value)) {
      updatedList = employmentList.filter(item => item !== value)
    }
    this.setState({employmentList: updatedList}, this.overtoJobs)
  }

  eachItem = value => (
    <li className="list-item-container">
      <input
        type="checkbox"
        id={value.employmentTypeId}
        value={value.employmentTypeId}
        onChange={this.handlefiltering}
      />
      <label htmlFor={value.employmentTypeId}>{`${value.label}`}</label>
    </li>
  )

  render() {
    return (
      <ul className="employmentType">
        <h3>Type of Employment</h3>
        {employmentTypesList.map(every => this.eachItem(every))}
      </ul>
    )
  }
}

export default EmploymentGroup
