import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import {Row, Col} from 'react-bootstrap'; // Container for all Rows/Components
import './ScreenMessage.css';

import iconID from '../../assets/id-blue.png';
import iconUser from '../../assets/user-blue.png';
import iconEmail from '../../assets/email-blue.png';

// Universal icons
import iconDashboard from '../../assets/dashboard-blue.png';
import iconYourAccount from '../../assets/your-account-blue.png';
import iconTicket from '../../assets/ticket-blue.png';

// System admin icons
import iconManageUsers from '../../assets/manage-users-blue.png';

//Trainer icons
import iconCreateExam from '../../assets/create-exam-blue.png';

//Trainee icons
import iconTakeExam from '../../assets/take-exam-blue.png';
import iconViewResults from '../../assets/view-results-blue.png';


const ScreenMessage = ({loggedInUser, currentScreen}) => {
    return (
        <div>
            <Row className="mt-5 pb-5 align-items-center">
                <Col className="" xs="auto">
                    <div className="welcomeMsg float-left">
                        
                        {currentScreen === "Dashboard" && (
                            <Row className="align-items-center">
                                <Col className="d-flex justify-content-center" xs="auto">
                                    <img className="screenMessageImage img-fluid" src={iconDashboard} alt="Dashboard"/>
                                </Col>
                                <Col className="ml-3">
                                    {"Welcome, " + loggedInUser.fname + " " + loggedInUser.lname}
                                </Col>
                            </Row>
                        )}

                        {currentScreen === "YourAccount" && (
                            <Row className="align-items-center">
                                <Col className="d-flex justify-content-center" xs="auto">
                                    <img className="screenMessageImage img-fluid" src={iconYourAccount} alt="Your Account"/>
                                </Col>
                                <Col className="ml-3">
                                    Your Account
                                </Col>
                            </Row>
                        )}

                        {currentScreen === "ManageUsers" && (
                            <Row className="align-items-center">
                                <Col className="d-flex justify-content-center" xs="auto">
                                    <img className="screenMessageImage img-fluid" src={iconManageUsers} alt="Manage Users"/>
                                </Col>
                                <Col className="ml-3">
                                    Manage System Users
                                </Col>
                            </Row>
                        )}

                        {currentScreen === "ManageTickets" && (
                            <Row className="align-items-center">
                                <Col className="d-flex justify-content-center" xs="auto">
                                    <img className="screenMessageImage img-fluid" src={iconTicket} alt="Manage Tickets"/>
                                </Col>
                                <Col className="ml-3">
                                    Manage Support Tickets
                                </Col>
                            </Row>
                        )}     

                        {currentScreen === "CreateExam" && (
                            <Row className="align-items-center">
                                <Col className="d-flex justify-content-center" xs="auto">
                                    <img className="screenMessageImage img-fluid" src={iconCreateExam} alt="Create Exam"/>
                                </Col>
                                <Col className="ml-3">
                                    Create Exam
                                </Col>
                            </Row>
                        )}

                        {currentScreen === "TakeExam" && (
                            <Row className="align-items-center">
                                <Col className="d-flex justify-content-center" xs="auto">
                                    <img className="screenMessageImage img-fluid" src={iconTakeExam} alt="Take Exam"/>
                                </Col>
                                <Col className="ml-3">
                                    Take Exam
                                </Col>
                            </Row>
                        )}

                        {currentScreen === "ViewResults" && (
                            <Row className="align-items-center">
                                <Col className="d-flex justify-content-center" xs="auto">
                                    <img className="screenMessageImage img-fluid" src={iconViewResults} alt="View Results"/>
                                </Col>
                                <Col className="ml-3">
                                    View Results
                                </Col>
                            </Row>
                        )}

                        {currentScreen === "GetSupport" && (
                            <Row className="align-items-center">
                                <Col className="d-flex justify-content-center" xs="auto">
                                    <img className="screenMessageImage img-fluid" src={iconTicket} alt="Get Support"/>
                                </Col>
                                <Col className="ml-3">
                                    Get Support
                                </Col>
                            </Row>
                        )}
                    </div>
                </Col>

                <Col className="">
                    <div className="userDetails float-right">
                        <Row className="align-items-center">
                            <Col className="d-flex justify-content-center p-0" xs="auto">
                                <img className="userDetailsIcon img-fluid" src={iconID} alt="ID"/>
                            </Col>
                            <Col className="pl-3">
                                {loggedInUser.id}
                            </Col>
                        </Row>

                        <Row className="align-items-center mt-2">
                            <Col className="d-flex justify-content-center p-0" xs="auto">
                                <img className="userDetailsIcon img-fluid" src={iconUser} alt="ID"/>
                            </Col>
                            <Col className="pl-3">
                                {loggedInUser.accountType}
                            </Col>
                        </Row>

                        <Row className="align-items-center mt-2">
                            <Col className="d-flex justify-content-center p-0" xs="auto">
                                <img className="userDetailsIcon img-fluid" src={iconEmail} alt="ID"/>
                            </Col>
                            <Col className="pl-3">
                                {loggedInUser.email}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ScreenMessage
