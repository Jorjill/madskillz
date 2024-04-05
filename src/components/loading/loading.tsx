import "./loading.less";

export const LoadingScreen: React.FC = () => {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div>Loading...</div>
      </div>
    );
  };