import "./Loading.css"

const Loading = () => {
  return (
    <div className="loading-modal-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <h3 className="loading-text">Processing...</h3>
        <p className="loading-subtext">Please wait while we complete your request</p>
      </div>
    </div>
  )
}

export default Loading
