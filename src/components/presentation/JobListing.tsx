import React from 'react';
import styles from './JobListing.module.css';

export interface JobListingProps {
    title: string;
    icon: string;
    owner: string;
    isSelected?: boolean;
};

const JobListing: React.FC<JobListingProps> = ({ title, icon, owner, isSelected }) => {
    return (
        <div className={`${styles.container} ${isSelected ? styles.selected : ''}`}>
            <div className={styles.jobDetails}>
                <span className={styles.icon}>{icon}</span>
                <span className={styles.title}>{title}</span>
            </div>
            <span className={styles.owner}>{owner}</span>
        </div>
    );
}

export default JobListing;
