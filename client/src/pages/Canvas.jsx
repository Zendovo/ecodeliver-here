import React from 'react'
import MapComponent from '../components/Map'
import SearchBox from '../components/SearchBox'

const Canvas = () => {
  return (
    <div className=' w-screen h-screen relative'> 
    <MapComponent />
    <SearchBox />
    </div>
  )
}

export default Canvas