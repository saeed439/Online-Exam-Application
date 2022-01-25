import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import './TakeExam.css';
import {Form, Button, Col, Row, InputGroup, Card} from 'react-bootstrap'; // Container for all Rows/Components


import {useState, useEffect} from 'react'; // React states to store API info

import Axios from 'axios' // for handling API Call
import Swal from 'sweetalert2'

const TakeExam = ({loggedInUser}) => {
    const [exams, setExams] = useState(
        [
            {
                title: "",
                endDate: "",
                description: ""
            }
        ]
    )

    const [currentExamID, setCurrentExamID] = useState(null)
    const [examQuestions, setExamQuestions] = useState(null)
    const [examOptions, setExamOptions] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [chosenOptions, setChosenOptions] = useState(null)
    const [briefExplanations, setBriefExplanations] = useState(null)
    const [nextDisabled, setNextDisabled] = useState(null)
    const [previousDisabled, setPreviousDisabled] = useState(true)
    const [examCompleted, setExamCompleted] = useState(false)

    //Effect Hook 
    useEffect( () =>
    {
        async function fetchTakenExams ()
        {
            try
            {
                var examsResponse = await Axios.post("http://localhost:3001/getTakenExams", { userID:parseInt(loggedInUser.id) }, {withCredentials: true })
                return examsResponse.data
            }
            catch (err) {console.log(err)}
        }
        
        async function fetchExams ()
        {
            var takenExams = await fetchTakenExams()

            try
            {
                var examsResponse = await Axios.get("http://localhost:3001/getExams", {withCredentials: true })
                var publishedExams = examsResponse.data
                var availableExams = []

                var i
                for (i=0; i<publishedExams.length; i++)
                {
                    var taken = false
                    
                    var j
                    for (j=0; j<takenExams.length; j++) {if (publishedExams[i].id === takenExams[j].examID){taken=true}}
                    
                    if (taken === false){availableExams.push(publishedExams[i])}
                }

                setExams(availableExams)

            }
            catch (err) {console.log(err)}
        }
        
        fetchExams()

    }, [examCompleted])

    async function startExam (event)
    {
        var examID = event.target.classList[0]

        try
        {
            var examContentResponse = await Axios.post("http://localhost:3001/getExamContent", { examID:examID }, {withCredentials: true })
            setExamQuestions(examContentResponse.data[0])
            setExamOptions(examContentResponse.data[1])

            var a = []
            var b = []
            var i
            for (i=0; i<examContentResponse.data[0].length; i++)
            {
                a.push(0)
                b.push("")
            }
            setExamCompleted(false)
            setChosenOptions(a)
            setBriefExplanations(b)
            setCurrentExamID(examID)
            if (examContentResponse.data[0].length === 1){setNextDisabled(true)}
            else{setNextDisabled(false)}
        }
        
        catch (err) {console.log(err)}
    }

    function optionChange (event)
    {
        var index = event.target.classList[0]
        var currentChosenOptions = chosenOptions.slice()
        currentChosenOptions[currentQuestion] = index
        setChosenOptions(currentChosenOptions)
    }

    function briefExplanationChange (event)
    {
        var value = event.target.value
        var currentBriefExplanations = briefExplanations.slice()
        currentBriefExplanations[currentQuestion] = value
        setBriefExplanations(currentBriefExplanations)
    }

    function nextQuestion ()
    {
        if (currentQuestion === examQuestions.length-2) {setNextDisabled(true); setPreviousDisabled(false); setCurrentQuestion(currentQuestion+1)}
        else {setNextDisabled(false); setPreviousDisabled(false); setCurrentQuestion(currentQuestion+1)}
        
    }

    function previousQuestion ()
    {
        if (currentQuestion === 1) {setPreviousDisabled(true); setNextDisabled(false); setCurrentQuestion(currentQuestion-1)}
        else {setPreviousDisabled(false); setNextDisabled(false); setCurrentQuestion(currentQuestion-1)}
    }

    async function handleSubmitAttempt (event)
    {
        event.preventDefault(event)
        
        var invalidAttempt = false
        var i
        for (i=0; i<briefExplanations.length; i++)
        {
            if (briefExplanations[i] === null || briefExplanations[i] === "")
            {
                invalidAttempt = true
            }
        }

        if (invalidAttempt === true)
        {
            await Swal.fire
            ({
                icon: 'error',
                title: 'Cannot submit your attempt',
                text: 'You must provide a brief explanation for each question'
            })
        }

        else if (invalidAttempt === false)
        {
            await Swal.fire(
            {
                title: 'Are you sure you want to submit your exam attempt?',
                text: 'Please make sure you have checked all of your answers!',
                showCancelButton: true,
                confirmButtonText: `Yes`,
            }).then( async (result) => 
            {
                if (result.isConfirmed) 
                {
                    var totalMarksAvailable = 0
                    var i
                    for (i=0; i<examOptions.length; i++)
                    {
                        var currentQuestionOptions = examOptions[i]
                        var j
                        for (j=0; j<currentQuestionOptions.length; j++)
                        {
                            var currentOption = currentQuestionOptions[j]
                            if (currentOption.answerMarks > 0)
                            {
                                totalMarksAvailable = totalMarksAvailable+ currentOption.answerMarks
                            }
                        }
                    }
        
                    var marksGained = 0
                    var k
                    for (k=0; k<chosenOptions.length; k++)
                    {
                        var chosenOptionIndex = parseInt(chosenOptions[k])
                        marksGained = marksGained + examOptions[k][chosenOptionIndex].answerMarks
                    }
        
                    if (marksGained < 0) {marksGained = 0}
        
                    var userid = parseInt(loggedInUser.id)
                    var examid = parseInt(currentExamID)
                    var score = marksGained+"/"+totalMarksAvailable
        
                    try
                    {
                        await Axios.post("http://localhost:3001/submitExam", { userID:userid, examID:examid, score:score }, {withCredentials: true})
                        
                        await Swal.fire
                        ({
                            icon: 'success',
                            title: 'You have successfully submitted your exam attempt!',
                        }).then ( () =>
                        {
                            setExamCompleted(true)
                            setExams(
                                [
                                    {
                                        title: "",
                                        endDate: "",
                                        description: ""
                                    }
                                ]
                            )
                        
                            setCurrentExamID(null)
                            setExamQuestions(null)
                            setExamOptions(null)
                            setCurrentQuestion(0)
                            setChosenOptions(null)
                            setBriefExplanations(null)
                            setNextDisabled(null)
                            setPreviousDisabled(true)
                        })
                    }
                    
                    catch (err)
                    { 
                        await Swal.fire
                        ({
                            icon: 'error',
                            title: 'Exam submission unsuccessful',
                            text: 'Please try again'
                        })
                    }
                }
            })
            
        }
    }


    if (exams.length === 0)
    {
        return (
            <p className="takeExamNoExam mt-4 text-center"> There are currently no exams set by your Trainer </p>
        )
    }

    if (examQuestions === null || examOptions === null || chosenOptions === null || briefExplanations === null || nextDisabled === null)
    {
        return (
            <div>
                <Row className="mt-4">
                    {exams.map((exam, index) =>
                    {
                        return (
                            <Col key={index} className="mx-auto mb-4" xs="4">
                                <Card bg="dark" text="white" className="">
                                    <Card.Body>
                                        <Card.Title>{exam.title}</Card.Title>
                                        <Card.Subtitle className="dateDue mb-2 text-muted"> {"Complete By: " + new Date(exam.endDate).toLocaleString()} </Card.Subtitle>
                                        <Card.Text> {exam.description} </Card.Text>
                                        <div className="d-flex justify-content-center">
                                            <Button className={exam.id + " normalButton"} variant="primary" onClick={startExam}> Start Exam </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>  
                        )
                    })}
                </Row>

            </div>
        )
    }

    else
    {
        return (
            <div>
                <Row className="mt-4">
                    <Col className="d-flex justify-content-center">

                        <Form className="takeExamSection" onSubmit={handleSubmitAttempt}>

                            <p className="mb-4 takeExamQuestion ">{parseInt(currentQuestion+1)+") " + examQuestions[currentQuestion].questionText}</p>

                            {examOptions[currentQuestion].map((answer, index) =>
                            {
                                var chosen = false
                                var border = "white"
                                if (parseInt(chosenOptions[currentQuestion]) === index) {chosen = true; border = "#4169e1"}
                                
                                return (
                                    <Form.Group>
                                        <label onClick={optionChange} key={index} className={index+" mb-2 p-2 takeExamOption"} style={ {border: "2pt solid "+border} }>
                                            <input className={index+" takeExamRadio mr-3"} type="radio" id={"option"+index} name="options" checked={chosen} onClick={optionChange} required/>
                                            <label className={index+" takeExamText ml-2"} for={"option"+index}> {answer.answerText} </label>
                                        </label>
                                    </Form.Group>
                                )
                            })}

                            <Form.Group className="">
                                <Form.Label className="takeExamBriefExplanation">Brief Explanation</Form.Label>
                                <Form.Control className="takeExamBriefExplanationContent" name="briefExplanation" type="text" placeholder="Enter an explanation for your answer here"  value={briefExplanations[currentQuestion]} onChange={briefExplanationChange} required />
                            </Form.Group>
                        

                            <div className="mt-4">
                                <Button onClick={previousQuestion} className="prevnext normalButton" variant="primary" disabled={previousDisabled}> Previous </Button>
                                <Button onClick={nextQuestion} className="prevnext ml-3 normalButton" variant="primary" disabled={nextDisabled}> Next </Button>

                                <Button type="submit" className="float-right normalButton" variant="primary"> Submit Attempt </Button>
                            </div>

                        </Form>

                    </Col>

                </Row>
            </div>  
        )
    }

}
    
    export default TakeExam