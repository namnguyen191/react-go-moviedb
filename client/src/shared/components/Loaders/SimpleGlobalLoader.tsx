import styles from './SimpleGlobalLoader.module.css';

const SimpleGlobalLoader: React.FC = () => {
  return (
    <div className={styles.simpleGlobalLoaderContainer}>
      <div className={styles.ldsSpinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default SimpleGlobalLoader;
