import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import {Button, Card, CardDeck} from 'react-bootstrap'; // Container for all Rows/Components

import iconYourAccount from '../../assets/your-account-blue.png';
import iconCreateExam from '../../assets/create-exam-blue.png';
import iconTicket from '../../assets/ticket-blue.png';

const Trainer = ({changeScreen}) => {
    function handleChangeScreen (e) {changeScreen(e)}
    
    return (
        <div>

            <CardDeck className="mt-5">
                <Card bg="dark" text="white" className="card text-center mr-5">
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




                <Card bg="dark" text="white" className="card text-center mr-5">
                    <Card.Img className="pt-3 cardImage mx-auto" variant="top" src={iconCreateExam}/>
                    <Card.Body>
                        <Card.Title> Create Exam </Card.Title>
                        <Card.Text>
                            Create and publish an exam for trainees to take.
                        </Card.Text>
                        <div className="d-flex justify-content-center">
                            <Button className="CreateExam normalButton" variant="primary" onClick={handleChangeScreen}> Create Exam </Button>
                        </div>
                    </Card.Body>
                </Card>



                <Card bg="dark" text="white" className="card text-center">
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
            </CardDeck>
        </div>
    )
}

export default Trainer
