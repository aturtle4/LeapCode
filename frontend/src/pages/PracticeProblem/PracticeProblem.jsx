import React from 'react'
import { useParams, useNavigate } from "react-router-dom";
import ProblemLeftBar from '../../components/PracticeProblem/ProblemLeftBar';
import ProblemTopBar from '../../components/PracticeProblem/ProblemTopBar';
import ProblemRightDraggableArea from '../../components/PracticeProblem/ProblemRightDraggableArea';

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