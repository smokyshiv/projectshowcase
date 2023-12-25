import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowCase extends Component {
  state = {
    activeCategoryId: categoriesList[0].id,
    projects: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.fetchProjects()
  }

  fetchProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeCategoryId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    try {
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        const updatedProjects = data.projects.map(each => ({
          id: each.id,
          imageUrl: each.image_url,
          name: each.name,
        }))
        this.setState({
          projects: updatedProjects,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        throw new Error('Failed to fetch projects')
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  handleCategoryChange = event => {
    this.setState({activeCategoryId: event.target.value}, this.fetchProjects)
  }

  renderSuccessView = () => {
    const {projects} = this.state
    return (
      <ul className="ul-card">
        {projects.map(each => (
          <li className="li-card" key={each.id}>
            <img className="image" src={each.imageUrl} alt={each.name} />
            <p className="heading">{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderInProgressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="card">
      <img
        className="image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retry}>
        Retry
      </button>
    </div>
  )

  retry = () => {
    this.fetchProjects()
  }

  renderPageView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state
    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            className="nav-image"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="list-container">
          <select
            className="select-class"
            onChange={this.handleCategoryChange}
            value={activeCategoryId}
            data-testid="categorySelector"
          >
            {categoriesList.map(category => (
              <option key={category.id} value={category.id}>
                {category.displayText}
              </option>
            ))}
          </select>
          {this.renderPageView()}
        </div>
      </div>
    )
  }
}

export default ProjectsShowCase
