import { LoginComponent } from './LoginButton'
import { Link } from 'react-router-dom';

export const Header = () => {
    return (
        <div className="header-container">
            <Link to="/blogs">
                <span className="header-title">AtCoder Blogs</span>
            </Link>
            <div className="login-component-container">
                <LoginComponent/>
            </div>
        </div>
    )
}