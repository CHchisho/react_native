import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

type UpdateContextType = {
  update: boolean;
  setUpdate: Dispatch<SetStateAction<boolean>>;
  triggerUpdate: () => void;
};

const UpdateContext = createContext<UpdateContextType | null>(null);

const UpdateProvider = ({children}: {children: React.ReactNode}) => {
  const [update, setUpdate] = useState<boolean>(false);

  const triggerUpdate = useCallback(() => {
    setUpdate((prevState) => !prevState);
  }, []);

  const contextValue = useMemo(
    () => ({
      update,
      setUpdate,
      triggerUpdate,
    }),
    [update, triggerUpdate],
  );

  return (
    <UpdateContext.Provider value={contextValue}>
      {children}
    </UpdateContext.Provider>
  );
};

export {UpdateProvider, UpdateContext};
