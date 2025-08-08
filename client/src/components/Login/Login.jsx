import "./Login.css"
import fruits from "../image/grapes.png"
import logo1 from "../image/logo.svg"
import {Link} from "react-router-dom"
const Login = () => {
  return (
    <div className="logincontainer">
        <div className="logincontainer1">
            <img className="logoimage" src={logo1} alt="err" />
            <img className="fruitss" src={fruits} alt="err"/>
        </div>
        <div className="logincontainer2">
            <h3 className="welcome">Welcome to Origin</h3>
            <p>Enter your credentials to access your account</p> <br />
            <span className="emailspan">E-mail</span> <br />
            <input className="emailinput" type="email" placeholder="Enter Email" required /><br />
            <span className="passspan">Password</span>
            <span className="forgotspan">Forgot Password?</span><br />
            <input className="passinput" type="password" placeholder="Case sensitive" required /><br />
            <input className="checkinput" type="checkbox" />
            <span className="remspan">Remember me</span><br /> <br />
            <Link to="/">
            <button className="loginbutton">Login</button></Link>
        </div>
    </div>
  )
}

export default Login