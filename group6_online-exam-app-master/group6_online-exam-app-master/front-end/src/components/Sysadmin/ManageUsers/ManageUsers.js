import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap css
import './ManageUsers.css';
import {Form, Button, ButtonGroup, InputGroup, Col, Row, FormGroup} from 'react-bootstrap' // Container for all Rows/Components

import {useState, useEffect} from 'react'; // React states to store API info

import Axios from 'axios' // for handling API Call
import Swal from 'sweetalert2'

const ManageUsers = ({loggedInUser}) => {
    // CREATE USER STATES
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [accountType, setAccountType] = useState("")
    const [accessKey, setAccessKey] = useState("")

    // EDIT USER STATES
    const [systemUsers, setSystemUsers] = useState(null)
    const [disallowEditUser, setDisllowEditUser] = useState(true)
    const [editChosenAccount, setEditChosenAccount] = useState(null)
    const [editChosenAccountName, setEditChosenAccountName] = useState("")
    const [editID, setEditID] = useState("")
    const [editEmail, setEditEmail] = useState("")
    const [editFname, setEditFname] = useState("")
    const [editLname, setEditLname] = useState("")
    const [editAccountType, setEditAccountType] = useState("")


    function padDigits(number, digits) {return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number}

    // generating a random access key
    function makeid(length) 
    {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) 
        {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        return result.join('');
    }

    // Effect Hook 
    useEffect( () =>
    {
        // POPULATING LISTS OF USERS WHICH CAN BE EDITED
        async function fetchSystemUsers ()
        {
            var systemUsersResponseData = null
            try
            {
                var systemUsersResponse = await Axios.get("http://localhost:3001/getUsers", {withCredentials: true })
                systemUsersResponseData = systemUsersResponse.data
                //console.log(systemUsersResponseData)
                setSystemUsers(systemUsersResponseData)
            }
            catch (err) 
            { 
                console.log(err)
            }
        }
        
        fetchSystemUsers()

    }, [accessKey, editChosenAccountName]) // Updates when CREATE USER access key generated


    

    // CREATE USER FUNCTIONS 
    
    // Update CREATE USER and some EDIT USER states when values changed
    function handleChange(event)
    {
        var changedBox = event.target.name
        var value = event.target.value
        if (changedBox === "fname"){setFname(value)}
        else if (changedBox === "lname"){setLname(value)}
        else if (changedBox === "accountType"){setAccountType(value)}

        else if (changedBox === "editEmail"){setEditEmail(value)}
        else if (changedBox === "editFname"){setEditFname(value)}
        else if (changedBox === "editLname"){setEditLname(value)}
        else if (changedBox === "editAccountType"){setEditAccountType(value)}
    }
    
    // handle submit of creating new user
    async function handleSubmitCreateUser(event)
    {
        event.preventDefault(event);

        var key = makeid(5)
        var createUserResponseData = null
        try
        {
            var createUserResponse = await Axios.post("http://localhost:3001/createUser", { fname:fname, lname:lname, accountType:accountType, accessKey:key }, {withCredentials: true})
            createUserResponseData = createUserResponse.data  

            setAccessKey(createUserResponseData.message+"-"+key)
            await Swal.fire
            ({
                icon: 'success',
                title: 'Access Key: ' + createUserResponseData.message+"-"+key,
                text: 'For: ' + fname + ' ' + lname
            })

        }
        catch (err) 
        { 
            console.log(err)
            await Swal.fire
            ({
                icon: 'error',
                title: 'User creation unsuccessful',
                text: err.response.data.message
            })
        }

        setAccessKey("")
        setFname("")
        setLname("")
        setAccountType("")
    }




    // EDIT USER FUNCTIONS
    
    // Update EDIT USER states when currentChosenUser changes
    function handleChangeChosenAccount(event)
    {
        var value = event.target.value
        var currentChosenUser = systemUsers[value]
        setEditChosenAccount(currentChosenUser)
        setEditChosenAccountName(value)
        setDisllowEditUser(false)
        
        setEditID(padDigits(currentChosenUser.id, 5))
        if (currentChosenUser.email === null) {setEditEmail("")}
        else {setEditEmail(currentChosenUser.email)}
        setEditFname(currentChosenUser.fname)
        setEditLname(currentChosenUser.lname)
        setEditAccountType(currentChosenUser.accountType)
    }

    // Handle submit of creating access key for existing user
    async function handleSubmitEditUserAccessKey(event)
    {
        event.preventDefault(event);

        var key = makeid(5)
        var generateAKResponseData = null
        try
        {
            var generateAKResponse = await Axios.put("http://localhost:3001/addAccessKey", { id:editChosenAccount.id, accessKey:key }, {withCredentials: true})
            generateAKResponseData = generateAKResponse.data  
            
            await Swal.fire
            ({
                icon: 'success',
                title: 'Access Key: ' + generateAKResponseData.message+"-"+key,
                text: 'For: ' + editFname + ' ' + editLname
            })
        }
        catch (err) 
        { 
            await Swal.fire
            ({
                icon: 'error',
                title: 'User creation unsuccessful',
                text: err.response.data.message
            })
        }

        setDisllowEditUser(true)
        setEditChosenAccountName("")
        setEditID("")
        setEditEmail("")
        setEditFname("")
        setEditLname("")
        setEditAccountType("")
    }

    
    // Handle submit of editing user details
    async function handleSubmitEditUser(event)
    {
        event.preventDefault(event);

        try
        {
            await Axios.put("http://localhost:3001/editUser", { id:editChosenAccount.id, email:editEmail, fname:editFname, lname:editLname, accountType:editAccountType }, {withCredentials: true})
            
            await Swal.fire
            ({
                icon: 'success',
                title: 'User successfully edited',
            })
        }
        catch (err) 
        { 
            await Swal.fire
            ({
                icon: 'error',
                title: 'User edit unsuccessful',
                text: err.response.data.message
            })
        }
        
        setDisllowEditUser(true)
        setEditChosenAccountName("")
        setEditID("")
        setEditEmail("")
        setEditFname("")
        setEditLname("")
        setEditAccountType("")
    }

    // Handle submit of deleting user from db
    async function handleSubmitDeleteUser()
    {
        try
        {
            await Axios.post("http://localhost:3001/deleteUser", { id:editChosenAccount.id }, {withCredentials: true})
            
            await Swal.fire
            ({
                icon: 'success',
                title: 'User successfully deleted',
            })
        }
        catch (err) 
        { 
            console.log(err.response)
            await Swal.fire
            ({
                icon: 'error',
                title: 'User delete unsuccessful',
                text: err.response.data.message
            })
        }
        
        setDisllowEditUser(true)
        setEditChosenAccountName("")
        setEditID("")
        setEditEmail("")
        setEditFname("")
        setEditLname("")
        setEditAccountType("")
    }


    if (systemUsers === null) { return(<div> LOADING </div>) }
    
    return (
        <div className="manageUsers">
            
            <Row className=" mt-5">
                <Col className="border-right pr-5">
                    <Form onSubmit={handleSubmitCreateUser}>
                        <p className="formTitle text-center"> Create New User </p>
                        
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control name="fname" type="text" placeholder="Enter user's first name" required onChange={handleChange} value={fname}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control name="lname" type="text" placeholder="Enter user's last name" required onChange={handleChange} value={lname}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Account Type</Form.Label>
                            <Form.Control name="accountType" as="select" required onChange={handleChange} value={accountType}>
                                <option hidden value="">Select user's account type</option>
                                <option>Trainee</option>
                                <option>Trainer</option>
                                <option>System Admin</option>
                            </Form.Control>
                        </Form.Group>

                        
                        <FormGroup className="mt-4" xs="auto">
                            <Button type="submit" className="normalButton" variant="primary">Create User</Button>
                        </FormGroup>

                    </Form>
                </Col>



                <Col className="pl-5">
                    <Form onSubmit={handleSubmitEditUserAccessKey}>
                        <p className="formTitle text-center"> Edit Existing User </p>

                        <Form.Group>
                            <Form.Label>Select User</Form.Label>
                            <InputGroup>
                                <Form.Control name="editChosenAccount" as="select" required onChange={handleChangeChosenAccount} value={editChosenAccountName}>
                                    <option hidden value="">Select user's account</option>
                                    {systemUsers.map((systemUser, index) =>
                                    (
                                        <option value={index}>{systemUser.fname + " " + systemUser.lname}</option>
                                    ))}
                                </Form.Control>
                                
                                <InputGroup.Append>
                                    <Button type="submit" className="normalButton" variant="primary" disabled={disallowEditUser}>Generate Access Key</Button>
                                    <Button onClick={handleSubmitDeleteUser} className="" variant="danger" disabled={disallowEditUser}> Delete User </Button>
                                </InputGroup.Append>
                            
                            </InputGroup>
                        </Form.Group>
                    </Form>


                    <Form onSubmit={handleSubmitEditUser}>
                        <Form.Row className="">
                            <Form.Group as={Col} className="">
                                <Form.Label>ID</Form.Label>
                                <Form.Control name="editID" type="text" placeholder="User's ID" readOnly onChange={handleChange} value={editID}/>
                            </Form.Group>

                            <Form.Group as={Col} className="">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name="editEmail" type="email" placeholder="User's email" readOnly={disallowEditUser} required onChange={handleChange} value={editEmail}/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row className="">
                            <Form.Group as={Col} className="">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control name="editFname" type="text" placeholder="User's first name" readOnly={disallowEditUser} required onChange={handleChange} value={editFname}/>
                            </Form.Group>

                            <Form.Group as={Col} className="">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control name="editLname" type="text" placeholder="User's last name" readOnly={disallowEditUser} required onChange={handleChange} value={editLname}/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Group className="">
                            <Form.Label>Account Type</Form.Label>
                            <Form.Control name="editAccountType" as="select" required disabled={disallowEditUser} onChange={handleChange} value={editAccountType}>
                                <option hidden value="">Select user's account</option>
                                <option>Trainee</option>
                                <option>Trainer</option>
                                <option>System Admin</option>
                            </Form.Control>
                        </Form.Group>

                        <ButtonGroup className="mt-2">
                            <Button type="submit" className="normalButton" variant="primary" disabled={disallowEditUser}> Confirm Edits </Button>
                        </ButtonGroup>

                    </Form>
                
                </Col>
            </Row>
        </div>
    )
}

export default ManageUsers
