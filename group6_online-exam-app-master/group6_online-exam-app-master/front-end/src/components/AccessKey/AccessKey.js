import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import './AccessKey.css';
import {Container, Form, Row, Col, Button, ButtonGroup} from 'react-bootstrap' // Container for all Rows/Components

import {useState, useEffect} from 'react';

import Axios from 'axios' // for handling API Call
import Swal from 'sweetalert2'

import App from '../../App.js'
import logo from '../../assets/logo-blue.png'

const AccessKey = ({accessKey}) => {

    const [userDetails, setUserDetails] = useState({fname:"Your first name", lname:"Your last name", id:"Your ID", accountType:"Your account type"})
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [complete, setComplete] = useState(false)

    function padDigits(number, digits) {return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number}

    //Effect Hook 
    useEffect( () =>
    {
        // POPULATING LISTS OF USERS WHICH CAN BE EDITED
        async function fetchUserDetails ()
        {
            var id = parseInt(accessKey.substring(0, accessKey.indexOf('-')))
            
            try
            {
                var userDetailsResponse = await Axios.post("http://localhost:3001/getUserDetails", { id:id }, {withCredentials: true})
                setUserDetails(userDetailsResponse.data.message)
                setEmail(userDetailsResponse.data.message.email)
            }
            catch (err) { console.log(err) }
        }
        
        if (accessKey !== null) {fetchUserDetails()}

    }, [accessKey]) // Updates when CREATE USER access key generated


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
            await Axios.put("http://localhost:3001/submitUser", { email:email, password:password, accessKey:accessKey }, {withCredentials: true})
            
            await Swal.fire
            ({
                icon: 'success',
                title: 'Changes successful',
            })
            setComplete(true)
        }
        catch (err)
        { 
            await Swal.fire
            ({
                icon: 'error',
                title: 'Changes unsuccessful',
                text: 'Please try again'
            })
            setComplete(false)
        }

    }

    if (complete === true) {return ( <App /> )}
    return (
        <div className="d-flex align-items-center vh-100 ">
            <Container className="">

                <Row className="">
                    <Col className="d-flex justify-content-center" >
                        <img className="loginLogo img-fluid" src={logo} alt="Logo"/>
                        <p className="accessKeyAppName ml-4" id="heading">Online Examination Application</p>
                    </Col>
                </Row>
                
                <Row className="mt-5">
                    <Col className=" d-flex justify-content-center">
                        <p className="accessKeyHeading"> Set your email/password: </p>
                    </Col>
                </Row>
                
                <Row className="">
                    <Col className=" mt-2 d-flex justify-content-center">

                        <Form className=" accessKeySection" onSubmit={handleSubmit}>
                        
                            <Form.Row className="">
                                <Form.Group as={Col} className="">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control className="accessKeyData" name="fname" type="text" placeholder={userDetails.fname} readOnly required />
                                </Form.Group>

                                <Form.Group as={Col} className="">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control className="accessKeyData" name="lname" type="text" placeholder={userDetails.lname} readOnly required />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row className="">
                                <Form.Group as={Col} className="">
                                    <Form.Label>ID</Form.Label>
                                    <Form.Control className="accessKeyData" name="id" type="text" placeholder={padDigits(userDetails.id, 5)} readOnly />
                                </Form.Group>

                                <Form.Group as={Col} className="">
                                    <Form.Label>Account Type</Form.Label>
                                    <Form.Control className="accessKeyData" name="accountType" type="text" placeholder={userDetails.accountType} readOnly required />
                                </Form.Group>
                            </Form.Row>

                            
                            <Form.Group  className="">
                                <Form.Label>Email</Form.Label>
                                <Form.Control className="accessKeyChangeableData" name="email" type="email" placeholder="Set an email" value={email} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group  className="">
                                <Form.Label>Password</Form.Label>
                                <Form.Control className="accessKeyChangeableData" name="password" type="password" placeholder="Set a password" value={password} onChange={handleChange} required />
                            </Form.Group>
                    

                            <ButtonGroup className="mt-2">
                                <Button type="submit" className="normalButton" variant="primary"> Confirm Changes</Button>
                            </ButtonGroup>
                        
                        </Form>

                    </Col>

                </Row>
            </Container>
        </div>
    )
}

export default AccessKey
