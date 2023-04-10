import Lottie from 'lottie-react';
import loadingIcon from "../../assets/images/loadingIcon.json";

export const LoadingIcon = ({ size }) =>
  <div className="d-flex justify-content-center align-items-center" style={{ height: size || `75vh` }}>
    <div style={{ maxHeight: `300px`, maxWidth: `300px` }}>
      <Lottie animationData={loadingIcon} loop={true} />
    </div>
  </div>;