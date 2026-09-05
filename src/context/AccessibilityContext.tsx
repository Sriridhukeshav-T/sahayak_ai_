import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  isAccessibilityMode: boolean;
  isHighContrast: boolean;
  toggleAccessibilityMode: () => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(() => {
    return localStorage.getItem('sahayak_a11y_mode') === 'true';
  });
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('sahayak_high_contrast') === 'true';
  });

  useEffect(() => {
    if (isAccessibilityMode) {
      document.body.classList.add('accessibility-mode');
    } else {
      document.body.classList.remove('accessibility-mode');
    }
    localStorage.setItem('sahayak_a11y_mode', String(isAccessibilityMode));
  }, [isAccessibilityMode]);

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('sahayak_high_contrast', String(isHighContrast));
  }, [isHighContrast]);

  const toggleAccessibilityMode = () => setIsAccessibilityMode(prev => !prev);
  const toggleHighContrast = () => setIsHighContrast(prev => !prev);

  return (
    <AccessibilityContext.Provider
      value={{
        isAccessibilityMode,
        isHighContrast,
        toggleAccessibilityMode,
        toggleHighContrast
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
