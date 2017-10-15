import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
    <header>
        <nav>
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/Login'>Login</Link></li>
                <li><Link to='/Files'>Files</Link></li>
            </ul>
        </nav>
    </header>
);

export default Header;