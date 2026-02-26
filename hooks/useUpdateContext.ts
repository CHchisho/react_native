import {useContext} from 'react';
import {UpdateContext} from '../contexts/UpdateContext';

export const useUpdateContext = () => {
  const context = useContext(UpdateContext);
  if (!context) {
    throw new Error('useUpdateContext must be used within an UpdateProvider');
  }
  return context;
};
