import React from 'react';
import LinkWrapper from '../../utils/LinkWrapper';
import './Header.css';

const Header = props => {

    return (
        <nav>
            <div className="nav-wrapper color-default Header">
                <LinkWrapper to="/" className="brand-logo" activeStyle={{}}>PackID</LinkWrapper>
                <ul className="right">
                    <li><LinkWrapper to='/about'>Sobre</LinkWrapper></li>
                </ul>
            </div>
            <div>
            </div>
        </nav>
    );
}
export default Header;
