import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import {Button, Form, ButtonGroup, Col, Row} from 'react-bootstrap'; // Container for all Rows/Components

import {useState, useEffect} from 'react';

import './YourAccount.css'

import Axios from 'axios' // for handling API Call
import Swal from 'sweetalert2'

const YourAccount = ({loggedInUser}) => {
    const [userDetails, setUserDetails] = useState({fname:"Your first name", lname:"Your last name", id:"Your ID", accountType:"Your account type"})
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function padDigits(number, digits) {return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number}

    //Effect Hook 
    useEffect( () =>
    {
        // POPULATING LISTS OF USERS WHICH CAN BE EDITED
        async function fetchUserDetails ()
        {
            var id = loggedInUser.id
            
            try
            {
                var userDetailsResponse = await Axios.post("http://localhost:3001/getUserDetails", { id:id }, {withCredentials: true})
                setUserDetails(userDetailsResponse.data.message)
            }
            catch (err) { console.log(err) }
        }
        
        if (loggedInUser !== null) {fetchUserDetails()}

    }, []) // Updates when CREATE USER access key generated


    function handleChange(event)
    {
        var changedBox = event.target.name
        var value = event.target.value
        if (changedBox === "email"){setEmail(value)}
        else if (changedBox === "password"){setPassword(value)}
    }

    async function handleSubmit(event)
    {
        event.preventDefault(event)
           
        try
        {
            await Axios.put("http://localhost:3001/editUserDetails", { id:userDetails.id, email:email, password:password }, {withCredentials: true})
            
            await Swal.fire
            ({
                icon: 'success',
                title: 'Changes successful',
            })
            
            setEmail("")
            setPassword("")
        }
        catch (err)
        { 
            await Swal.fire
            ({
                icon: 'error',
                title: 'Changes unsuccessful',
                text: 'Please try again'
            })
        }


    }


    return (
        <div >
        
            <Row className="mt-4">
                <Col className="d-flex justify-content-center">

                    <Form className="yourAccountSection" onSubmit={handleSubmit}>
                        
                        <Form.Row className="">
                            <Form.Group as={Col} className="">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control className="yourAccountData" name="fname" type="text" value={userDetails.fname} readOnly required />
                            </Form.Group>

                            <Form.Group as={Col} className="">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control className="yourAccountData" name="lname" type="text" value={userDetails.lname} readOnly required />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row className="">
                            <Form.Group as={Col} className="">
                                <Form.Label>ID</Form.Label>
                                <Form.Control className="yourAccountData" name="id" type="text" value={padDigits(userDetails.id, 5)} readOnly />
                            </Form.Group>

                            <Form.Group as={Col} className="">
                                <Form.Label>Account Type</Form.Label>
                                <Form.Control className="yourAccountData" name="accountType" type="text" value={userDetails.accountType} readOnly required />
                            </Form.Group>
                        </Form.Row>

                        
                        <Form.Group  className="">
                            <Form.Label>Email</Form.Label>
                            <Form.Control className="yourAccountDataChangeable" name="email" type="email" placeholder="Change your email" onChange={handleChange} value={email} required />
                        </Form.Group>

                        <Form.Group  className="">
                            <Form.Label>Password</Form.Label>
                            <Form.Control className="yourAccountDataChangeable" name="password" type="password" placeholder="Change your password" onChange={handleChange} value={password} required />
                        </Form.Group>
                        

                        <ButtonGroup className="mt-2">
                            <Button type="submit" className="normalButton" variant="primary"> Confirm Changes</Button>
                        </ButtonGroup>
                        
                    </Form>

                </Col>

            </Row>

        </div>
    )
}
    
export default YourAccount