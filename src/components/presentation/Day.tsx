import React, { useEffect, useState } from 'react';
import styles from './Day.module.css';

interface DayProps {
  title: string;
  dayLabel: string;
  isScheduled?: boolean;
  onChangeSchedule?(dayLabel: string, scheduled: boolean): void;
}

const Day: React.FC<DayProps> = (props) => {

  // We want to keep state locally while it syncs with the server
  const [shouldSchedule, setShouldSchedule] = useState(props.isScheduled);

  // If the scheduled value changes in a remote update, 
  // make sure to overwrite our local cached version
  useEffect(() => {
    setShouldSchedule(props.isScheduled);
  }, [props.isScheduled]);

  // When they click, toggle whether the day is selected
  const handleClick = () => {
    const toggled = !shouldSchedule;
    setShouldSchedule(toggled);
    props.onChangeSchedule?.(props.dayLabel, toggled);
  }
  
  return (
    <a className={styles.Day}
       {...{scheduled: shouldSchedule ? 'true' : 'false'}} 
       onClick={handleClick}>
      <span>
        {props.title}
      </span>
    </a>
  );
}

export default Day;