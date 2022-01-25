import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import './ViewResults.css';
import {Form, Button, ButtonGroup, Col, Row} from 'react-bootstrap'; // Container for all Rows/Components

import {useState, useEffect} from 'react'; // React states to store API info
import Axios from 'axios' // for handling API Call

const ViewResults = ({loggedInUser}) => {

    function padDigits(number, digits) {return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number}
    
    const [results, setResults] = useState(null)


    //Effect Hook 
    useEffect( () =>
    {
        async function fetchResults ()
        {
            try
            {
                var resultsResponse = await Axios.post("http://localhost:3001/getResults", { userID:parseInt(loggedInUser.id) }, {withCredentials: true })
                setResults(resultsResponse.data)
            }
            catch (err) {console.log(err)}
        }
        
        fetchResults()

    }, [])
    

    if (results === null || results.length === 0)
    {
        return (
            <p className="takeExamNoExam mt-4 text-center"> You currently have no results to view </p>
        )
    }


    return (
        <div className="mt-4 viewResultsSection mx-auto">     
            <table>
                <tr>
                    <th>Exam ID</th>
                    <th>Exam Title</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Date</th>
                </tr>

                
                {results.map((result, index) =>
                {
                    var grade = Math.round(eval(result.score)*100)
                    var examDate = new Date(result.date).toLocaleDateString('en-GB')
                    var colourGrade = "nothing"
                    if (grade < 50) {colourGrade="fail"}

                    return (
                        <tr id={colourGrade} key={index}>
                            <td> {padDigits(result.examID, 5)} </td>
                            <td> {result.examTitle} </td>
                            <td> {result.score} </td>
                            <td> {grade+"%"} </td>
                            <td> {examDate} </td>
                        </tr>
                    )
                })}


                
            </table>
        </div>
    )
}

export default ViewResults
