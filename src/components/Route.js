import React from 'react'
import RouteInputRow from './RouteInputRow';

export default ({handleRouteChange}) => {
  return (
    <div className='route'>
      <RouteInputRow direction="from" handleRouteChange={handleRouteChange}/>
      <RouteInputRow direction="to" handleRouteChange={handleRouteChange}/>
    </div>
  )
}