import React from 'react';
import Week from './Week';
import styles from './Weeks.module.css';

interface WeekProps {
  weeks: string[][];
  dayLabels: string[];
  onChangeSchedule?(dayLabel: string, scheduled: boolean): void;
}

const Weeks: React.FC<WeekProps> = (props) => {
  return (
    <span className={styles.Weeks}>
       {props.weeks.map((week, index) => 
         <Week key={`Week${index}`}
               week={index + 1} 
               days={week}
               dayLabels={props.dayLabels} 
               onChangeSchedule={props.onChangeSchedule}/>
       )}
    </span>
  );
}

export default Weeks;