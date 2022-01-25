import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import {Button, Card, Col, Row} from 'react-bootstrap'; // Container for all Rows/Components

import iconYourAccount from '../../assets/your-account-blue.png';
import iconTicket from '../../assets/ticket-blue.png';
import iconTakeExam from '../../assets/take-exam-blue.png';
import iconViewResults from '../../assets/view-results-blue.png';

const Sysadmin = ({changeScreen}) => {
    function handleChangeScreen (e) {changeScreen(e)}
    
    return (
        <div>

            <Row className="mt-4">
                
                <Col className="d-flex justify-content-center pr-0" xs="6">
                    <Card bg="dark" text="white" className="cardTrainee text-center">
                        <Card.Img className="pt-3 cardImage mx-auto" variant="top" src={iconYourAccount}/>
                        <Card.Body>
                            <Card.Title> Your Account </Card.Title>
                            <Card.Text>
                                View information about your account and change details.
                            </Card.Text>
                            <div className="d-flex justify-content-center">
                                <Button className="YourAccount normalButton" variant="primary" onClick={handleChangeScreen}> Your Account </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>



                <Col className="d-flex justify-content-center pl-0" xs="6">
                    <Card bg="dark" text="white" className="cardTrainee text-center " >
                        <Card.Img className="pt-3 cardImage mx-auto" variant="top" src={iconTakeExam}/>
                        <Card.Body>
                            <Card.Title> Take Exam </Card.Title>
                            <Card.Text>
                                Take exams set by your Trainer.
                                <br /><br />
                            </Card.Text>
                            <div className="d-flex justify-content-center">
                                <Button className="TakeExam normalButton" variant="primary" onClick={handleChangeScreen}> Take Exam </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col className="mt-4 d-flex justify-content-center pr-0" xs="6">
                        <Card bg="dark" text="white" className="cardTrainee text-center">
                            <Card.Img className="pt-3 cardImage mx-auto" variant="top" src={iconViewResults}/>
                            <Card.Body>
                                <Card.Title> View Results </Card.Title>
                                <Card.Text>
                                    View results for previous exams.
                                    <br /><br />
                                </Card.Text>
                                <div className="d-flex justify-content-center">
                                    <Button className="ViewResults normalButton" variant="primary" onClick={handleChangeScreen}> View Results </Button>
                                </div>
                            </Card.Body>
                        </Card>
                </Col>

                <Col className="mt-4 d-flex justify-content-center pl-0" xs="6">
                    <Card bg="dark" text="white" className="cardTrainee text-center">
                        <Card.Img className="pt-3 cardImage mx-auto" variant="top" src={iconTicket}/>
                        <Card.Body>
                            <Card.Title> Get Support </Card.Title>
                            <Card.Text>
                                Create a support ticket if you need help.
                                <br /><br />
                            </Card.Text>
                            <div className="d-flex justify-content-center">
                                <Button className="GetSupport normalButton" variant="primary" onClick={handleChangeScreen}> Get Support </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

        </div>
    )
}

export default Sysadmin
