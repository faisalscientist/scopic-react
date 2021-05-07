import React, { useState } from 'react'
import { useHistory } from 'react-router';

const Login = () => {
  const history = useHistory();
  const [user, setUser] = useState('user1')

  const handleChange = (e) => {
    setUser(e.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault();
    localStorage.setItem('user', user);
    history.push('/');
  }
  
  return (
    <div className="h-screen">
      <div className="container mx-auto h-full flex justify-center items-center px-5">
        <div className="bg-white py-8 px-5 border-gray-300 border rounded-lg w-11/12 md:w-5/12">
          <div className="text-center mb-3">Login</div>
          <hr/>
          <div>
            <form className="flex flex-col space-y-8 mt-10 pb-8" onSubmit={handleSubmit}>
              <div className="flex-1 flex flex-col mt-5">
                <label htmlFor="user" className="mb-2">User</label>
                <div className="flex border border-gray-300 px-3 py-2 rounded-lg">
                  <input onChange={handleChange} className="flex-1 outline-none focus:outline-none" name="user" type="text" id="user" defaultValue={user} placeholder="User"/>
                </div>
              </div>
              <button type="submit" className="outline-none bg-blue-500  hover:bg-blue-600  mt-10 py-2 rounded-lg text-white">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
