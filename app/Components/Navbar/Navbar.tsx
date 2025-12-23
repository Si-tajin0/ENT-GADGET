import React from 'react'
import TopNav from './TopNav'
import MiddleNav from './MiddleNav'
import BottomNav from './BottomNav'

const Navbar = () => {
  return (
    <>
        <header>
            <TopNav/>
            <MiddleNav/>
            <BottomNav/>
        </header>
    </>
  )
}

export default Navbar