import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import {Button, Card, CardDeck} from 'react-bootstrap'; // Container for all Rows/Components

import iconYourAccount from '../../assets/your-account-blue.png';
import iconManageUsers from '../../assets/manage-users-blue.png';
import iconTicket from '../../assets/ticket-blue.png';

const Sysadmin = ({changeScreen}) => {
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
                    <Card.Img className="pt-3 cardImage mx-auto" variant="top" src={iconManageUsers}/>
                    <Card.Body>
                        <Card.Title> Manage System Users </Card.Title>
                        <Card.Text>
                            Create and manage user accounts for the system.
                        </Card.Text>
                        <div className="d-flex justify-content-center">
                            <Button className="ManageUsers normalButton" variant="primary" onClick={handleChangeScreen}> Manage Users </Button>
                        </div>
                    </Card.Body>
                </Card>

                <Card bg="dark" text="white" className="card text-center">
                    <Card.Img className="pt-3 cardImage mx-auto" variant="top" src={iconTicket}/>
                    <Card.Body>
                        <Card.Title> Manage Support Tickets </Card.Title>
                        <Card.Text>
                            View and resolve support tickets submitted by users.
                        </Card.Text>
                        <div className="d-flex justify-content-center">
                            <Button className="ManageTickets normalButton" variant="primary" onClick={handleChangeScreen}> Manage Tickets </Button>
                        </div>
                    </Card.Body>
                </Card>

            </CardDeck>
            
        </div>
    )
}

export default Sysadmin
