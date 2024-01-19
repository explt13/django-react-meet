import React, { useState } from 'react'
import Navbar from './UI/Navbar/Navbar'
import Sidebar from './UI/Sidebar/Sidebar'
import SidebarContent from './SidebarContent'

const Navigation = () => {
    const [sidebar, setSidebar] = useState(false)

    return (
        <>
            <Navbar setSidebar={setSidebar}/>
            <Sidebar setVisible={setSidebar} visible={sidebar}>
                <SidebarContent setSidebarVisible={setSidebar}/>
            </Sidebar>
        </>
  )
}

export default Navigation