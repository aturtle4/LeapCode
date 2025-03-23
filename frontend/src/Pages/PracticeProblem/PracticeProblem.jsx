import React from 'react'
import { useParams, useNavigate } from "react-router-dom";
import ProblemLeftBar from '../../Components/PracticeProblem/ProblemLeftBar';
import ProblemTopBar from '../../Components/PracticeProblem/ProblemTopBar';
import ProblemRightDraggableArea from '../../Components/PracticeProblem/ProblemRightDraggableArea';

function PracticeProblem({darkMode, toggleDarkMode}) {
    const { treeid, problemName, problemid } = useParams();
  return (
    <div>
        <ProblemTopBar />
        <ProblemLeftBar />
        <ProblemRightDraggableArea />
    </div>
  )
}

export default PracticeProblem