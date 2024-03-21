import React from 'react';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
import './SurveyStyles.css';
import LinearProgress from '@mui/material/LinearProgress';
import surveyJSON from '../data/surveyModel.json';

class SurveyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCompleted: false,
      showInstructions: false,
      currentIndex: 0,
    };
    this.instructionsButtonRef = React.createRef();
    this.closeButtonRef = React.createRef();
    this.model = new Survey.Model(surveyJSON);
    this.model.onCurrentPageChanged.add(() => {
      this.updateProgress();
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  updateProgress = () => {
    this.setState({
      currentIndex: this.model.currentPageNo,
    });
  };

  getProgress = () => {
    const { currentIndex } = this.state;
    const total = this.model.pageCount;
    return (currentIndex / (total - 1)) * 100;
  };

  toggleInstructions = () => {
    this.setState(prevState => ({
      showInstructions: !prevState.showInstructions
    }));
  };

  handleViewPastSubmissions = () => {
    // Placeholder for functionality to view past submissions
    console.log('View Past Submissions button clicked');
  };

  handleKeyDown = (e) => {
    if (e.key === 'Escape' && this.state.showInstructions) {
      this.toggleInstructions();
    }
  };

  onCompleteComponent = (survey) => {
    const surveyData = survey.data;
    this.setState({ isCompleted: true });

    // Process your survey data here
    // For example, send it to a server
    fetch('YOUR_SERVER_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(surveyData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  render() {
    return (
      <div className="main-content">
        <div className="survey-container">
          <LinearProgress variant="determinate" value={this.getProgress()} />
          
          <button
            onClick={this.handleViewPastSubmissions}
            className="view-past-button">
            View Past Submissions
          </button>

          <button
            ref={this.instructionsButtonRef}
            onClick={this.toggleInstructions}
            className="instructions-button">
            Instructions
          </button>
          
          {this.state.showInstructions && (
            <div className="instructions-popup" onClick={this.handleOverlayClick}>
              <div className="instructions-content">
                <span
                  ref={this.closeButtonRef}
                  className="close-btn"
                  onClick={this.toggleInstructions}>
                  &times;
                </span>
                <p>Your instructions text goes here...</p>
              </div>
            </div>
          )}

          {this.state.isCompleted ? (
            <div>Thank you for completing the survey!</div>
          ) : (
            <Survey.Survey
              model={this.model}
              onComplete={this.onCompleteComponent}
            />
          )}
        </div>
      </div>
    );
  }
}

export default SurveyComponent;
