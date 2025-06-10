import React from 'react'
import RoomList from './RoomList'
import { RoomCardHouse } from './CardHouseRoom';





export const LayoutRoom = ({ rooms, type }) => {
  const roomms = rooms;

  return (
    <>
      {
        (type === 'hotel' || type ==='guesthouse') ? 


        <>
        
        <RoomList rooms={roomms} />
        
        </>
        
        
        
        
         : (
          <div className="grid  grid-cols-1 md:grid-cols-2 gap-4 ">
            {roomms.map((room, i) => {
              return (
                <>
                  <RoomCardHouse room={room} key={i} />
                  </>
              );
            })}
          </div>
        )
      }
    </>
  )
}
