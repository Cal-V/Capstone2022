import React from 'react'
import "./modal.css"

function Modal({userMethods,setLoginVisible}) {
    return (
        <div className='modal'>
            <div className='modal-main'>
                <form id="login-form" onSubmit={userMethods.handleSubmit}>
                    <label htmlFor="username">Username: </label>
                    <input type="text" value={userMethods.username} placeholder="Username" onChange={({ target }) => userMethods.setUsername(target.value)}/>
                    <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" value={userMethods.password} placeholder="Password" onChange={({ target }) => userMethods.setPassword(target.value)}/>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <button onClick={userMethods.handleSignUp}>Sign Up</button>
                <button className='transform-button' onClick={() => setLoginVisible(false)}>Close</button>
            </div>
        </div>
    )
}

export default Modal