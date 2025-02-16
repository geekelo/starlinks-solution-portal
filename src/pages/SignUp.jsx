import Navbar from '../components/Navbar';

const SignUp = () => (
  <>
    <Navbar />
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-header">
          <h1>Sign Up</h1>
          <p>Create your Starlink account</p>
        </div>

        <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
          <div className="name-fields">
            <div className="form-group">
              <input type="text" id="fname" name="fname" placeholder="First Name" required />
            </div>

            <div className="form-group">
              <input type="text" id="mname" name="mname" placeholder="Middle Name" />
            </div>

            <div className="form-group">
              <input type="text" id="lname" name="lname" placeholder="Last Name" required />
            </div>
          </div>

          <div className="form-group">
            <input type="email" id="email" name="email" placeholder="Email Address" required />
          </div>

          <div className="form-group">
            <input type="password" id="password" name="password" placeholder="Password" required />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              placeholder="Confirm Password"
              required
            />
          </div>

          <div className="form-group">
            <input type="tel" id="whatsapp" name="whatsapp" placeholder="WhatsApp Number" required />
          </div>

          <div className="form-group">
            <input type="tel" id="phone" name="phone" placeholder="Phone Number" required />
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  </>
);

export default SignUp;
