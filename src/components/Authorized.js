import React from 'react'
import { Link, Redirect, Route } from 'react-router-dom'
import { CogIcon, LogoutIcon, UserIcon } from '@heroicons/react/outline'

const Authorized = ({ component: Component, ...rest}) => {
  const logout = () => {
    localStorage.removeItem('user');
  }
  return (
    <Route
        {...rest}
        render={props => {
          if(localStorage.getItem('user')){
            return <>
              <div>
                <div className="px-5 md:px-10 py-5">
                  <div className="flex justify-between items-center">
                    <div className="font-light text-3xl">
                      <b>Auction</b>
                    </div>
                    <Link to="/autobid-configuration">
                      <div className="flex text-blue-500 justify-center items-center space-x-1 hover:text-blue-600">
                        <CogIcon className="h-5 w-5" />
                        <div className="hidden md:inline">Auto-Bidding Configuration</div>
                      </div> 
                    </Link>
                    <div className="flex space-x-10">
                      <div className="flex">
                        <UserIcon className="h-5 w-5" />
                        <div>({localStorage.getItem('user')})</div>
                      </div>
                      <Link to="/login">
                        <div onClick={logout} className="flex justify-center items-center space-x-1 hover:text-gray-900">
                          <div>Logout</div>
                          <LogoutIcon className="h-5 w-5" />
                        </div> 
                      </Link>
                    </div>
                  </div>
                  <div className="border border-gray-300 mt-3"></div>
                </div>
              </div>
              <Component {...props} />
            </>
          } else {
            return (
                <Redirect to={{
                        pathname: '/login',
                        state: {
                            from: props.location
                        }
                    }}
                />
            )
          }
        }}
    />
)
}

export default Authorized
