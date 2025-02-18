import Navbar from '../components/Navbar';
import '../styles/ActivateCode.css';

const ActivateCode = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Navbar />
      <div className="activate-container">
        <div className="activate-content">
          <div className="activate-header">
            <h1>Activate Code</h1>
          </div>

          <form className="activate-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" id="code" name="code" placeholder="Enter your activation code" required />
            </div>

            <button type="submit" className="activate-button">
              Activate
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ActivateCode;
