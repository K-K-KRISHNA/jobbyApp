import {Component} from 'react'
import './index.css'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class SalaryRange extends Component {
  state = {
    activeSalary: '',
  }

  onChangeSalaray = event =>
    this.setState({activeSalary: event.target.value}, this.updateInJobs)

  updateInJobs = () => {
    const {activeSalary} = this.state
    const {salaryChange} = this.props
    salaryChange(activeSalary)
  }

  eachItem = value => (
    <li className="list-item-container">
      <input
        type="radio"
        value={value.salaryRangeId}
        name="salary"
        id={value.salaryRangeId}
        onChange={this.onChangeSalaray}
      />
      <label htmlFor={value.salaryRangeId}>{`${value.label}`}</label>
    </li>
  )

  render() {
    return (
      <ul className="employmentType">
        <h3>Salary Range</h3>
        {salaryRangesList.map(every => this.eachItem(every))}
      </ul>
    )
  }
}

export default SalaryRange
