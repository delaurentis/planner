import React from 'react';
import Day from './Day';
import styles from './Week.module.css';

interface WeekProps {
  week: number,
  days?: string[];
  dayLabels: string[];
  onChangeSchedule?(dayLabel: string, scheduled: boolean): void;
}

const Week: React.FC<WeekProps> = (props) => {

  // Figure out what our days are (weekdays only!)
  const dayTitles = props.days || ['M','T','W','Th','F'];
  const days: any[] = dayTitles.map(dayTitle => {
    return { title: dayTitle, label: `📅 W${props.week}${dayTitle}` };
  });

  // Pass up schedule state changes for days to the parent
  const handleChangeSchedule = (dayLabel, scheduled) => props.onChangeSchedule?.(dayLabel, scheduled);
  
  return (
    <span className={styles.Week}>
       <span className={styles.BeforeWeek}/>
       {days.map(day => 
         <Day key={day.label} 
              title={day.title}
              dayLabel={day.label} 
              isScheduled={props.dayLabels.includes(day.label)}
              onChangeSchedule={handleChangeSchedule}/>
       )}
       <span className={styles.AfterWeek}/>
    </span>
  );
}

export default Week;