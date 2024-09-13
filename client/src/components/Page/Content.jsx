import React from 'react'

import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';
import SideDrawer from './SideDrawer';
import Header from './Header';

const Content = ( props ) => {
    const {
        children,
        headerHeight,
        footerHeight,
        sideDrawerWidth=25,
        debug,
    } = props;

    const {
        openSearchDrawer,
    } = ChatState();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        // Logs user out; messages server, deletes localstorage. 
        localStorage.removeItem( 'userInfo' );
        console.log( "User has been logged out." );
        // setUser( null );
        navigate( '/' );
    }

    return (
        <>
            <Header />
            <SideDrawer
                open={ openSearchDrawer }
                width={ `${ 25 }%` }
                placement={ 'left' }
            />
        </>
    )
}

export default Content
