import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import './ManageTickets.css';
import {Button, Col, Row} from 'react-bootstrap'; // Container for all Rows/Components

import {useState, useEffect} from 'react'; // React states to store API info

import Axios from 'axios' // for handling API Call
import Swal from 'sweetalert2'


const ManageTickets = ({loggedInUser}) => {

    function padDigits(number, digits) {return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number}

    const [tickets, setTickets] = useState([])
    const [ticketSolved, setTicketSolved] = useState(null)

    //Effect Hook 
    useEffect( () =>
    {
        async function fetchTickets ()
        {
            try
            {
                var ticketsResponse = await Axios.get("http://localhost:3001/getTickets", {withCredentials: true })
                setTickets(ticketsResponse.data)
            }
            catch (err) {console.log(err)}
        }
        
        fetchTickets()

    }, [ticketSolved])
    
    
    async function handleSolveTicket(event)
    {
        var ticketid = event.target.classList[0]

        await Swal.fire(
        {
            title: 'Are you sure you want to resolve this ticket?',
            showCancelButton: true,
            confirmButtonText: `Yes`,
        }).then( async (result) =>
        {
            if (result.isConfirmed) 
            {
                try
                {
                    await Axios.post("http://localhost:3001/deleteTicket", { ticketID:ticketid }, {withCredentials: true})
                    
                    await Swal.fire
                    ({
                        icon: 'success',
                        title: 'Ticket successfully resolved!',
                    })
                    setTicketSolved(ticketid)
                }
                
                catch (err) 
                { 
                    console.log(err.response)
                    await Swal.fire
                    ({
                        icon: 'error',
                        title: 'Ticket has not been resolved in database',
                        text: err.response.data
                    })
                }
            }
        })

    }

    
    
    if (tickets.length === 0)
    {
        return (
            <p className="takeExamNoExam mt-4 text-center"> There are currently no tickets to resolve! </p>
        )
    }

    return (
        <div className="manageTicketsSection mx-auto mt-4">

            {tickets.map((ticket, index) =>
            {
                return (
                    <div key={index} className="mb-4" id='box'>
                        <Row>
                            <Col>Ticket ID:</Col>
                            <Col>User ID:</Col>
                            <Col>Account Type:</Col>
                            <Col>Ticket Type:</Col>
                        </Row>
        
                        <Row>
                            <Col> <strong>{padDigits(ticket.id, 5)}</strong> </Col>
                            <Col> <strong>{padDigits(ticket.userID, 5)}</strong> </Col>
                            <Col> <strong>{ticket.accountType}</strong> </Col>
                            <Col> <strong>{ticket.ticketType}</strong> </Col>
                        </Row>
                        
                        <p className="mt-2 mb-0">Futher Information:</p>
                        <p className="m-0"> {ticket.ticketDescription} </p>
        
                        <Button onClick={handleSolveTicket} className={ticket.id + " mt-3 btnTicketSolved normalButton"} variant="primary"> Resolved </Button>
                    </div>
                )
            })}
            

        
        </div>
    )
}
    
export default ManageTickets