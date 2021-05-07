import React from 'react'
import { Redirect, Route } from 'react-router'

const Visitor = ({ component: Component, ...rest}) => {
  return (
    <Route
        {...rest}
        render={props => {
          if(!localStorage.getItem('user')){
            return  <Component {...props} />
          } else {
            return (
                <Redirect to={{
                        pathname: '/items',
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

export default Visitor
