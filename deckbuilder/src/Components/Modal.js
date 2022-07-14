import React from 'react'
import "./modal.css"

function Modal({userMethods,setLoginVisible}) {
    return (
        <div className='modal'>
            <div className='modal-main'>
                <form id="login-form" onSubmit={userMethods.handleSubmit}>
                    <label htmlFor="username">Username: </label>
                    <input className='modal-text-box' type="text" value={userMethods.username} placeholder="Username" onChange={({ target }) => userMethods.setUsername(target.value)}/>
                    <label htmlFor="password">Password: </label>
                    <input className='modal-text-box' type="password" value={userMethods.password} placeholder="Password" onChange={({ target }) => userMethods.setPassword(target.value)}/>
                    <br />
                    <button  className='login-form-button'type="submit">Login</button>
                    <button className='login-form-button'  onClick={userMethods.handleSignUp}>Sign Up</button>
                </form>
                <button className='login-form-button' id='modal-close-button' onClick={() => setLoginVisible(false)}>Close</button>
            </div>
        </div>
    )
}

export default Modal