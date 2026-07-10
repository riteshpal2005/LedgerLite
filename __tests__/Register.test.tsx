import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import RegisterScreen from '../src/features/auth/components/Register';
import { AuthService } from '../src/core/services/authService';
import { useDispatch } from 'react-redux';
import { completeOnboarding } from '../src/core/store/settingsSlice';

// Mock dependencies
jest.mock('expo-router', () => ({
  Link: ({ children }: any) => children,
  useRouter: () => ({ back: jest.fn() }),
}));
jest.mock('../src/core/services/authService', () => ({
  AuthService: {
    registerWithEmail: jest.fn(),
  },
}));
jest.mock('../src/core/theme/ThemeContext', () => ({
  useTheme: () => ({ activeThemeClass: 'dark' }),
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
jest.mock('../src/core/store/settingsSlice', () => ({
  completeOnboarding: jest.fn(),
}));

// Mock expo-vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    __esModule: true,
    ...Reanimated,
    FadeInDown: {
      duration: () => ({
        springify: () => ({
          delay: () => ({
            duration: () => ({
              springify: () => ({})
            })
          })
        })
      }),
      delay: () => ({
        duration: () => ({
          springify: () => ({})
        })
      })
    }
  };
});

// Mock alert
let mockShowAlert = jest.fn();
jest.mock('../src/shared/components/CustomAlert', () => ({
  useAlert: () => ({
    showAlert: mockShowAlert,
    hideAlert: jest.fn(),
    alertConfig: { visible: false },
  }),
  CustomAlert: () => null,
}));

describe('RegisterScreen', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<RegisterScreen />);
    expect(screen.getByText('Create Account')).toBeTruthy();
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(screen.getAllByPlaceholderText('••••••••').length).toBe(2);
  });

  it('validates email format', () => {
    render(<RegisterScreen />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    
    fireEvent.changeText(emailInput, 'invalid-email');
    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
    
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(screen.queryByText('Please enter a valid email address')).toBeNull();
  });

  it('shows error if fields are empty on submit', async () => {
    render(<RegisterScreen />);
    fireEvent.press(screen.getByText('Sign Up'));
    expect(mockShowAlert).toHaveBeenCalledWith('Error', 'Please fill out all fields.');
  });

  it('shows error if email is invalid on submit', async () => {
    render(<RegisterScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'invalid');
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.changeText(passwordInputs[0], 'password');
    fireEvent.changeText(passwordInputs[1], 'password');
    
    fireEvent.press(screen.getByText('Sign Up'));
    
    expect(mockShowAlert).toHaveBeenCalledWith('Error', 'Please fix the email address before continuing.');
  });

  it('shows error if passwords do not match', async () => {
    render(<RegisterScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.changeText(passwordInputs[0], 'password123');
    fireEvent.changeText(passwordInputs[1], 'password456');
    
    fireEvent.press(screen.getByText('Sign Up'));
    
    expect(mockShowAlert).toHaveBeenCalledWith('Error', 'Passwords do not match.');
  });

  it('calls registerWithEmail on successful submission', async () => {
    render(<RegisterScreen />);
    (AuthService.registerWithEmail as jest.Mock).mockResolvedValueOnce({ error: null });
    
    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.changeText(passwordInputs[0], 'password123');
    fireEvent.changeText(passwordInputs[1], 'password123');
    fireEvent.press(screen.getByText('Sign Up'));
    
    await waitFor(() => {
      expect(AuthService.registerWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(dispatchMock).toHaveBeenCalledWith(completeOnboarding());
    });
  });

  it('shows alert on registration failure', async () => {
    render(<RegisterScreen />);
    (AuthService.registerWithEmail as jest.Mock).mockResolvedValueOnce({ error: 'Registration failed' });
    
    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.changeText(passwordInputs[0], 'password123');
    fireEvent.changeText(passwordInputs[1], 'password123');
    fireEvent.press(screen.getByText('Sign Up'));
    
    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith('Registration Failed', 'Registration failed');
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });
});
