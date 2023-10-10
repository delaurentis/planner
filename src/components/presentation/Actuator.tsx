import React from 'react';
import Button from './Button'; // Ensure the correct path
import styles from './Actuator.module.css'; // Ensure the correct path

interface ActuatorProps {
  title: string;
  description: string;
  buttonText: string;
  isDisabled?: boolean;
  onActuate: () => void;
}

const Actuator: React.FC<ActuatorProps> = (props: ActuatorProps) => {

  const handleActuate = () => {
    if ( !props.isDisabled ) {
      props?.onActuate();
    }
  }
  
  return (
    <div className={styles.Actuator}>
      <div className={styles.ActuatorInfo}>
        <div className={styles.ActuatorTitle}>{props.title}</div>
        <div className={styles.ActuatorDescription}>{props.description}</div>
      </div>
      <Button title={props.buttonText} onClick={handleActuate} size='medium' isDisabled={props.isDisabled}/>
    </div>
  );
}

export default Actuator;
