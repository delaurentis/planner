import React from 'react';
import styles from './IconStats.module.css';

interface IconStatsProps {
  stats: any[];
}

const IconStats: React.FC<IconStatsProps> = (props) => {
  
  return (
    <span className={styles.IconStats}>
       {
         props.stats.map(stat => 
          <span className={styles.IconStat}>
            <span className={styles.Icon}>{stat.icon}</span>
            <span className={styles.Stat}>{stat.value}</span>
          </span>
  )
      }
    </span>
  );
}

export default IconStats;