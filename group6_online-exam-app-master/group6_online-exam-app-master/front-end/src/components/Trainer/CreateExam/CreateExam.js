import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import './CreateExam.css';
import {Form, Button, Col, Row, InputGroup} from 'react-bootstrap'; // Container for all Rows/Components

import {useState, useEffect} from 'react'; // React states to store API info

import Axios from 'axios' // for handling API Call
import Swal from 'sweetalert2'

const CreateExam = ({loggedInUser}) => {
    const [examTitle, setExamTitle] = useState("")
    const [examDescription, setExamDescription] = useState("")
    const [examStartDate, setExamStartDate] = useState("")
    const [examEndDate, setExamEndDate] = useState("")


    const [questions, setQuestions] = useState(
        [
            {
                questionText: "",
                answerOptions: 
                [
                    {answerText: "", answerMarks: ""},
                ]
            }
        ]
    )
    const [currentQuestion, setCurrentQuestion] = useState(0)

    const [buttonClicked, setButtonClicked] = useState(null)
    const [deleteQuestionDisabled, setDeleteQuestionDisabled] = useState(true)
    const [questionDeleted, setQuestionDeleted] = useState(0)
    
    const [showExamDetails, setShowExamDetails] = useState(true)
    const [showReviewExam, setShowReviewExam] = useState(false)

    //Effect Hook 
    useEffect( () =>
    {
        function canDeleteQuestion ()
        {
            if (questions.length === 1) {setDeleteQuestionDisabled(true)}
            else {setDeleteQuestionDisabled(false)} 
        }
        if (currentQuestion !== null) {canDeleteQuestion()}

    }, [currentQuestion, questionDeleted])
    
    
    function handleChange(event)
    {
        var changedBox = event.target.name
        var value = event.target.value
        
        var currentQuestions = questions.slice()
        var index = event.target.classList[0]
        
        if (changedBox === "questionText")
        {

            currentQuestions[currentQuestion].questionText = value
            setQuestions(currentQuestions)
        }

        else if (changedBox === "answerText")
        {
            currentQuestions[currentQuestion].answerOptions[index].answerText = value
            setQuestions(currentQuestions)
        }

        else if (changedBox === "answerMarks")
        {
            currentQuestions[currentQuestion].answerOptions[index].answerMarks = value
            setQuestions(currentQuestions)
        }

        else if (changedBox === "examTitle")
        {
            setExamTitle(value)
        }

        else if (changedBox === "examDesc")
        {
            setExamDescription(value)
        }

        else if (changedBox === "examStartDate")
        {
            setExamStartDate(value)
        }

        else if (changedBox === "examEndDate")
        {
            setExamEndDate(value)
        }
    }


    function addAnswer ()
    {
        var newAnswer = {answerText: "", answerMarks: ""}
        var currentQuestions = questions.slice()

        currentQuestions[currentQuestion].answerOptions.push(newAnswer)
        setQuestions(currentQuestions)
    }

    function removeAnswer (event)
    {
        var index = event.target.classList[0]
        var currentQuestions = questions.slice()

        currentQuestions[currentQuestion].answerOptions.splice(index, 1)
        setQuestions(currentQuestions)     
    }

    async function deleteQuestion (event)
    {
        await Swal.fire(
        {
            title: 'Are you sure you want to delete this question?',
            showCancelButton: true,
            confirmButtonText: `Yes`,
        }).then((result) => 
        {
            if (result.isConfirmed) 
            {
                var currentQuestions = questions.slice()
                currentQuestions.splice(currentQuestion, 1)
                
                if (questions.length === currentQuestion+1) {setCurrentQuestion(currentQuestion-1)}
                
                setQuestions(currentQuestions)
                setQuestionDeleted(questionDeleted+1)
                //console.log(questions)
                
            }
     
        })
    }


    function prevQuestion ()
    {
        if (currentQuestion === 0)
        {
            setShowExamDetails(true)
        }
        else
        {
            var currentQuestionNum = currentQuestion
            setCurrentQuestion(currentQuestionNum-1)
        }

    }


    async function handleSubmit (event)
    {
        event.preventDefault(event)
        
        if (buttonClicked === "nextQuestion")
        {
            if (currentQuestion+1 === questions.length)
            {
                await Swal.fire(
                {
                    title: 'Do you want to create another question?',
                    showCancelButton: true,
                    confirmButtonText: `Yes`,
                }).then((result) => 
                {
                    if (result.isConfirmed) 
                    {
                        var currentQuestions = questions.slice()
                        var newQuestion =
                        {
                            questionText: "",
                            answerOptions: 
                            [
                                {answerText: "", answerMarks: ""},
                            ]
                        }
                        currentQuestions.push(newQuestion)
                        setQuestions(currentQuestions)
                        setCurrentQuestion(currentQuestion+1)
                    }
                })
            }

            else {setCurrentQuestion(currentQuestion+1)}
            
            
        }


        if (buttonClicked === "reviewExam")
        {
            setCurrentQuestion(0)
            setShowReviewExam(true)
        }
    }

    async function handleSubmitExamDetails (event)
    {
        event.preventDefault(event)

    
        if (examStartDate >= examEndDate || new Date(examStartDate) <= new Date())
        {
            await Swal.fire
            ({
                icon: 'error',
                title: 'Incorrect Exam Details',
                text: 'Invalid exam start/end dates selected'
            })
        }

        else
        {
            setShowExamDetails(false)
        }
    }

    function getTotalMarksAvailable ()
    {
        var totalMarks = 0;
        var i;
        var j;
        
        for (i=0; i<questions.length; i++)
        {
            var currentQuestion = questions[i]
            for (j=0; j<currentQuestion.answerOptions.length; j++)
            {
                var currentAnswer = currentQuestion.answerOptions[j]
                if (parseInt(currentAnswer.answerMarks) > 0) {totalMarks = totalMarks + parseInt(currentAnswer.answerMarks)}
            }
        }
        return totalMarks
    }

    async function handleSubmitPublishExam (event)
    {
        event.preventDefault(event);
        await Swal.fire(
        {
            title: 'Do you want to publish this exam?',
            showCancelButton: true,
            confirmButtonText: `Yes`,
        }).then( async (result) => 
        {
            if (result.isConfirmed) 
            {
                try
                {
                    await Axios.post("http://localhost:3001/createExam", { examTitle:examTitle, examDescription:examDescription, examStartDate:examStartDate, examEndDate:examEndDate, questions:questions }, {withCredentials: true})
                    
                    await Swal.fire
                    ({
                        icon: 'success',
                        title: 'Exam creation successful',
                    }).then ( () =>
                    {
                        setExamTitle("")
                        setExamDescription("")
                        setExamStartDate("")
                        setExamEndDate("")
                        setQuestions(
                            [
                                {
                                    questionText: "",
                                    answerOptions: 
                                    [
                                        {answerText: "", answerMarks: ""},
                                    ]
                                }
                            ]
                        )
                        setCurrentQuestion(0)
                        setButtonClicked(null)
                        setDeleteQuestionDisabled(true)
                        setQuestionDeleted(0)
                        setShowReviewExam(false)
                        setShowExamDetails(true)
                    })
                }
                
                catch (err)
                { 
                    await Swal.fire
                    ({
                        icon: 'error',
                        title: 'Exam creation unsuccessful',
                        text: err.response.data.message
                    })
                }
            }
        })
    }



    if (showExamDetails)
    {
        return (
            <div>
                <Row className="mt-4">
                    <Col className="d-flex justify-content-center">

                        <Form className="createExamDetails" onSubmit={handleSubmitExamDetails}>
                            
                            <p className="createExamDetailsTitle text-center mb-4">Exam Details</p>

                            <Form.Group className="">
                                <Form.Label className="createExamDetailsContent">Exam Title</Form.Label>
                                <Form.Control className="createExamDetailsContent" name="examTitle" type="text" placeholder="Enter the exam title here"  value={examTitle} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group className="">
                                <Form.Label className="createExamDetailsContent">Exam Description</Form.Label>
                                <Form.Control className="createExamDetailsContent" name="examDesc" as="textarea" placeholder="Enter the exam description here"  value={examDescription} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Row className="">
                                <Form.Group as={Col} className="">
                                    <Form.Label className="createExamDetailsContent">Exam Start Date</Form.Label>
                                    <Form.Control className="createExamDetailsContent" name="examStartDate" type="datetime-local" value={examStartDate} onChange={handleChange} required />
                                </Form.Group>

                                <Form.Group as={Col} className="">
                                    <Form.Label className="createExamDetailsContent">Exam End Date</Form.Label>
                                    <Form.Control className="createExamDetailsContent" name="examEndDate" type="datetime-local"  value={examEndDate} onChange={handleChange} required />
                                </Form.Group>
                            </Form.Row>

                            <Button type="submit" className="mt-3 prevnext normalButton" variant="primary"> Next </Button>
                        
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }


    if (showReviewExam)
    {
        return (
            <Row className="mt-4">
                <Col className="d-flex justify-content-center">

                    <Form className="createExamDetails" onSubmit={handleSubmitPublishExam}>


                        <p className="createExamDetailsTitle text-center mb-4">Exam Summary</p>

                        
                        <Form.Group className="">
                            <Form.Label className="createExamDetailsContent">Exam Title</Form.Label>
                            <Form.Control className="createExamDetailsContent" type="text" readOnly value={examTitle} />
                        </Form.Group>

                        <Form.Group className="">
                            <Form.Label className="createExamDetailsContent">Exam Description</Form.Label>
                            <Form.Control className="createExamDetailsContent" as="textarea" readOnly value={examDescription} />
                        </Form.Group>

                        <Form.Row className="">
                            <Form.Group as={Col} className="">
                                <Form.Label className="createExamDetailsContent">Exam Start Date</Form.Label>
                                <Form.Control className="createExamDetailsContent" type="datetime-local" readOnly value={examStartDate} />
                            </Form.Group>

                            <Form.Group as={Col} className="">
                                <Form.Label className="createExamDetailsContent">Exam End Date</Form.Label>
                                <Form.Control className="createExamDetailsContent" type="datetime-local"  readOnly value={examEndDate} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row className="">
                            <Form.Group as={Col} className="">
                                <Form.Label className="createExamDetailsContent">Total Number of Questions</Form.Label>
                                <Form.Control className="createExamDetailsContent" type="text" readOnly value={questions.length} />
                            </Form.Group>

                            <Form.Group as={Col} className="">
                                <Form.Label className="createExamDetailsContent">Total Marks Available</Form.Label>
                                <Form.Control className="createExamDetailsContent" type="text" readOnly value={getTotalMarksAvailable()} />
                            </Form.Group>
                        </Form.Row>

                        <div className="mt-3">
                            <Button onClick={() => {setShowReviewExam(false); setShowExamDetails(true)}} className="normalButton" variant="primary"> Make Changes </Button>
                            <Button type="submit" className="float-right normalButton" variant="primary"> Publish Exam </Button>
                        </div>
                    
                    </Form>
                </Col>
            </Row>
        )
    }
    
    
    
    return (
        <div>
            <Row className="mt-4">
                <Col className="d-flex justify-content-center">

                    <Form className="createExamSection" onSubmit={handleSubmit}>

 
                        <p className="createExamQuestionNumber mb-4">{"Question " + parseInt(currentQuestion+1)}</p>

                        
                        <Form.Group className="">
                            <Form.Label className="createExamQuestions">Question Text</Form.Label>
                            <Form.Control className="createExamQuestions" name="questionText" as="textarea" placeholder="Enter your question text here" value={questions[currentQuestion].questionText} onChange={handleChange} required />
                        </Form.Group>


                        
                            {questions[currentQuestion].answerOptions.map((answer, index) =>
                            {
                                var disabled = false
                                if (questions[currentQuestion].answerOptions.length === 1) {disabled=true}
                                return (
                                    <Form.Group key={index} className="createExamQuestions">
                                        <Form.Label>{"Answer Option " + parseInt(index+1)} </Form.Label>
                                        <InputGroup>
                                            <Form.Control className={index + " createExamQuestions"} name="answerText" type="text" placeholder="Enter an answer for your question here" value={answer.answerText} onChange={handleChange} required />
                                            
                                            <InputGroup.Append>
                                                <Form.Control className={index + " createExamQuestions createExamAnswerMarks"} name="answerMarks" type="number" placeholder="Marks" value={answer.answerMarks} onChange={handleChange} required />
                                            </InputGroup.Append>
        
                                            <Button onClick={removeAnswer} className={index + " ml-2"} variant="danger" disabled={disabled}> - </Button>
                            
                                        
                                        </InputGroup>

                                        {questions[currentQuestion].answerOptions.length === parseInt(index+1) && (
                                        <Button onClick={addAnswer} className="mt-2 normalButton" variant="primary"> + </Button>
                                        )}

                                    </Form.Group>
                                    
                                )
                            })}
                            
                        
                        
                        <div className="mt-4">
                            <Button onClick={prevQuestion} className="prevnext normalButton" variant="primary"> Previous </Button>
                            <Button type="submit" onClick={() => (setButtonClicked("nextQuestion"))} className="prevnext ml-3 normalButton" variant="primary"> Next </Button>
                            <Button onClick={deleteQuestion} className="ml-3" variant="danger" disabled={deleteQuestionDisabled}> Delete Question </Button>
                            <Button type="submit" onClick={() => (setButtonClicked("reviewExam"))} className="float-right normalButton" variant="primary"> Review Exam </Button>
                        </div>


                        


                        
                    </Form>

                </Col>

            </Row>
        </div>  
    )
    }
    
    export default CreateExam