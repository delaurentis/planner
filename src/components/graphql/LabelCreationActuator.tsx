import React, { useState, FC } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import Actuator from 'components/presentation/Actuator'; // Ensure this path is correct
import { CREATE_GROUP_LABEL, FETCH_EXISTING_LABELS } from 'data/queries';

interface Props {
  groupId?: string;
}

const LabelCreationActuator: FC<Props> = ({ groupId }) => {
  const [createLabel] = useMutation(CREATE_GROUP_LABEL);
  const { data: existingLabelsData, loading: loadingExistingLabels } = useQuery(FETCH_EXISTING_LABELS, {
    variables: { groupId },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentLabel, setCurrentLabel] = useState<string>('');

  const existingLabels = existingLabelsData?.groupLabels || [];

  const handleCreateLabels = async (): Promise<void> => {
    if (loadingExistingLabels) return;
  
    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);
  
    const currentYear = new Date().getFullYear();
    const years = [currentYear % 100, (currentYear + 1) % 100].map(String);  // Get last two digits of each year and convert to string
    const totalLabels = 4 * 6 * years.length;
    
    try {
      for (const yy of years) {
        for (let q = 1; q <= 4; q++) {
          for (let s = 1; s <= 6; s++) {
            const labelName = `${yy}Q${q}S${s}`;
  
            if (existingLabels.some(label => label.name === labelName)) {
              continue;
            }
  
            setCurrentLabel(labelName);
            const input = {
              name: labelName,
              color: '#EEEEEE',
            };
  
            await createLabel({
              variables: {
                groupId,
                input,
              },
            });
            setProgress((progress) => progress + (100 / totalLabels));
          }
        }
      }
      setSuccess(true);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };  

  const getActuatorProps = () => {
    if (loading) {
      return {
        title: 'Creating Labels...',
        description: `${progress.toFixed(0)}% complete. Currently creating ${currentLabel}.`,
        isDisabled: true,
      };
    }
    if (error) {
      return {
        title: 'Error Creating Labels',
        description: `Error: ${error.message}`,
        isDisabled: false,
      };
    }
    if (success) {
      return {
        title: 'Successfully Created Labels',
        description: 'You may create more labels if needed.',
        isDisabled: false,
      };
    }
    return {
      title: 'Create Labels',
      description: 'Create labels for each quarter/sprint of this year and next year.',
      isDisabled: loadingExistingLabels,
    };
  };

  const { title, description, isDisabled } = getActuatorProps();

  return (
    <Actuator
      title={title}
      description={description}
      buttonText="Create Labels"
      onActuate={handleCreateLabels}
      isDisabled={isDisabled}
    />
  );
};

export default LabelCreationActuator;
