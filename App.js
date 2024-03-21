import React from 'react';
import SurveyComponent from './components/SurveyComponent';
import surveyJSON from './data/surveyModel.json';
import './App.css';
import '@mui/material/styles';



function App() {
    return (
        <div className="App">
            <SurveyComponent json={surveyJSON} />
        </div>
    );
}

export default App;
