import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import {Form, Button, Col, Row, Card} from 'react-bootstrap'; // Container for all Rows/Components
import './GetSupport.css'

import {useState, useEffect} from 'react'; // React states to store API info

import Axios from 'axios' // for handling API Call
import Swal from 'sweetalert2'


const GetSupport = ({loggedInUser}) => {

    function padDigits(number, digits) {return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number}

    const [tickets, setTickets] = useState([])
    const [ticketType, setTicketType] = useState("")
    const [ticketDescription, setTicketDescription] = useState("")
    const [ticketSubmitted, setTicketSubmitted] = useState(false)
    
    //Effect Hook 
    useEffect( () =>
    {
        async function fetchUserTickets ()
        {
            try
            {
                var ticketsResponse = await Axios.post("http://localhost:3001/getUserTickets", { userID:parseInt(loggedInUser.id) }, {withCredentials: true })
                setTickets(ticketsResponse.data)
            }
            catch (err) {console.log(err)}
        }
        
        fetchUserTickets()

    }, [ticketSubmitted])

    function handleChange (event)
    {
        var changedBox = event.target.name
        var value = event.target.value
        
        if (changedBox === "ticketType"){setTicketType(value)}
        else if (changedBox === "ticketDescription"){setTicketDescription(value)}
    }

    async function handleSubmit (event)
    {
        event.preventDefault(event)
        console.log(loggedInUser)

        try
        {
            await Axios.post("http://localhost:3001/submitTicket", { userID:parseInt(loggedInUser.id), accountType:loggedInUser.accountType, ticketType:ticketType, ticketDescription:ticketDescription }, {withCredentials: true })
            await Swal.fire
            ({
                icon: 'success',
                title: 'Your ticket has been submitted!',
            }).then ( () =>
            {
                setTicketType("")
                setTicketDescription("")
                setTicketSubmitted(true)
            })
        }
        catch (err) 
        {
            await Swal.fire
            ({
                icon: 'error',
                title: 'Ticket submission unsuccessfull',
                text: 'Please try again'
            })
        }
    }

    if (tickets.length === 0)
    {
        return (
            <div>
                <Form className="getSupportCreateTicket mt-4 mx-auto" onSubmit={handleSubmit}>
                    <Form.Group className="">
                        <Form.Label>Ticket Type</Form.Label>
                        <Form.Control name="ticketType" as="select" onChange={handleChange} required>
                            <option hidden value="">Select Ticket Type</option>
                            <option>Bug/Error</option>
                        </Form.Control>
                    </Form.Group>


                    <Form.Group>
                        <Form.Label>Futher Information: </Form.Label>
                        <Form.Control name="ticketDescription" as="textarea" placeholder="Enter further information about the issue" onChange={handleChange} required/>
                    </Form.Group>

                    
                    <Button className="normalButton prevnext" variant="primary" type="submit"> Submit </Button>
                    
                </Form>
            </div>
        )
    }

    return (
        <div>
        <Row className="mt-4">
            {tickets.map((ticket, index) =>
            {
                return (
                    <Col key={index} className="mx-auto mb-4" xs="4">
                        <Card bg="dark" text="white" className="">
                            <Card.Body>
                                <Card.Title>{"Open Ticket: "+ticket.ticketType}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted"> {"Ticket ID: " + padDigits(ticket.id, 5)} </Card.Subtitle>
                                <Card.Text className="getSupportTicketDescription"> 
                                    <p className="mt-3 mb-0">{"Ticket Description: " + ticket.ticketDescription} </p>  
                                    <p className="mt-1 mb-0"> Status: Open </p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>  
                )
            })}
        </Row>

    </div>
    )
}
    
    export default GetSupport