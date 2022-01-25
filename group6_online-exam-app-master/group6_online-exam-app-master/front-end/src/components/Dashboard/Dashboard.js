import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import './Dashboard.css';
import {Container, Navbar, Nav, Button, Row, Col} from 'react-bootstrap'; // Container for all Rows/Components

import ScreenMessage from '../ScreenMessage/ScreenMessage'

// Card decks for the three users
import Sysadmin from './Sysadmin'
import Trainer from './Trainer'
import Trainee from './Trainee'

// Universal screen
import YourAccount from '../YourAccount/YourAccount'

// System Admin screens
import ManageUsers from '../Sysadmin/ManageUsers/ManageUsers'
import ManageTickets from '../Sysadmin/ManageTickets/ManageTickets'

// Trainer screens
import CreateExam from '../Trainer/CreateExam/CreateExam'

// Trainee screens
import TakeExam from '../Trainee/TakeExam/TakeExam'
import ViewResults from '../Trainee/ViewResults/ViewResults'

// general screens
import GetSupport from '../GetSupport/GetSupport'


import logo from '../../assets/logo-blue.png'

import {useState, useEffect} from 'react'; // React states to store API info
import Axios from 'axios' // for handling API Call



const Dashboard = () => {

    const [loggedInUser, setLoggedInUser] = useState(null)
    const [chosenScreen, setChosenScreen] = useState("Dashboard")
    const [userFunctionality, setUserFunctionality] = useState(null)

    function padDigits(number, digits) {return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number}

    const changeScreen = (e) => {setChosenScreen(e.target.classList[0])} 

    function signOut() {window.location.reload();}

    // Effect Hook
    useEffect( () =>
    {
        async function fetchLoggedInUser ()
        {
            var loggedInResponseData = null
            try
            {
                var loggedInResponse = await Axios.get("http://localhost:3001/loggedIn", {withCredentials: true })
                loggedInResponseData = {id:padDigits(loggedInResponse.data.message.id, 5), email:loggedInResponse.data.message.email, fname:loggedInResponse.data.message.fname, lname:loggedInResponse.data.message.lname, accountType:loggedInResponse.data.message.accountType}
                
            }
            catch (err) { console.log(err.response) }
            
            setLoggedInUser(loggedInResponseData)
            
            var loggedInUserAccountType = loggedInResponseData.accountType 
            if (loggedInUserAccountType === "System Admin") {setUserFunctionality(["Dashboard", "Your Account", "Manage Users", "Manage Tickets"])}
            else if (loggedInUserAccountType === "Trainer") {setUserFunctionality(["Dashboard", "Your Account", "Create Exam", "Get Support"])}
            else if (loggedInUserAccountType === "Trainee") {setUserFunctionality(["Dashboard", "Your Account", "Take Exam", "View Results", "Get Support"])}
        }
        
        fetchLoggedInUser()

    }, [chosenScreen])
    
    if (loggedInUser === null || userFunctionality === null) { return(<div> LOADING </div>) }


    
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand className="brand">
                        <Row className="align-items-center">
                            <Col className="">
                                <img className="logo img-fluid" src={logo} alt="Logo"/>
                            </Col>
                            <Col className="p-0">
                                Online Examination Application
                            </Col>
                        </Row>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="links ml-auto ">
                            {userFunctionality.map((functionality) =>
                            {
                                var navActive = ""
                                if (chosenScreen === functionality.replace(/\s/g, '')) {navActive = "active"}
                                return (<Nav.Link className={functionality.replace(/\s/g, '') + " " + navActive +" mr-3"} href="" onClick={changeScreen}>{functionality}</Nav.Link>)
                            })}

                        </Nav>
                        <Button onClick={signOut} className="outlineButton ml-2" variant="outline-primary">Sign Out</Button>
                    </Navbar.Collapse>
                
                </Container>
            </Navbar>

            
            <Container>

                <ScreenMessage loggedInUser={loggedInUser} currentScreen={chosenScreen}/>
                {loggedInUser.accountType === "System Admin" && chosenScreen === "Dashboard" && (<Sysadmin changeScreen={changeScreen} />)}
                {loggedInUser.accountType === "Trainer" && chosenScreen === "Dashboard" && (<Trainer changeScreen={changeScreen} />)}
                {loggedInUser.accountType === "Trainee" && chosenScreen === "Dashboard" && (<Trainee changeScreen={changeScreen} />)}
                
                {chosenScreen === "YourAccount" && (<YourAccount loggedInUser={loggedInUser}/>)}
                {chosenScreen === "ManageUsers" && (<ManageUsers loggedInUser={loggedInUser}/>)}
                {chosenScreen === "CreateExam" && (<CreateExam loggedInUser={loggedInUser}/>)}
                {chosenScreen === "TakeExam" && (<TakeExam loggedInUser={loggedInUser}/>)}
                {chosenScreen === "GetSupport" && (<GetSupport loggedInUser={loggedInUser}/>)}
                {chosenScreen === "ManageTickets" && (<ManageTickets loggedInUser={loggedInUser}/>)}
                {chosenScreen === "ViewResults" && (<ViewResults loggedInUser={loggedInUser}/>)}


            </Container>


        </div>
    )
}

export default Dashboard
