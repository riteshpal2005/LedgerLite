import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import LoginScreen from '../src/features/auth/components/Login';
import { AuthService } from '../src/core/services/authService';
import { useDispatch } from 'react-redux';
import { completeOnboarding } from '../src/core/store/settingsSlice';

// Mock dependencies
jest.mock('expo-router', () => ({
  Link: ({ children }: any) => children,
}));
jest.mock('../src/core/services/authService', () => ({
  AuthService: {
    signInWithEmail: jest.fn(),
    signInWithGoogle: jest.fn(),
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

describe('LoginScreen', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
  });

  it('render view works', () => {
    const { View, Text } = require('react-native');
    const result = render(<View><Text>Test</Text></View>);
    console.log('View render keys:', Object.keys(result));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    const result = await render(<LoginScreen />);
    console.log('Result after await:', Object.keys(result));
    expect(screen.getByText('Welcome Back')).toBeTruthy();
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy();
  });

  it('validates email format', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('you@example.com');
    
    fireEvent.changeText(emailInput, 'invalid-email');
    expect(getByText('Please enter a valid email address')).toBeTruthy();
    
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(queryByText('Please enter a valid email address')).toBeNull();
  });

  it('shows error if fields are empty on submit', async () => {
    await render(<LoginScreen />);
    fireEvent.press(screen.getByText('Sign In'));
    expect(mockShowAlert).toHaveBeenCalledWith('Error', 'Please enter both email and password.');
  });

  it('shows error if email is invalid on submit', async () => {
    await render(<LoginScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'invalid');
    fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'password');
    fireEvent.press(screen.getByText('Sign In'));
    
    expect(mockShowAlert).toHaveBeenCalledWith('Error', 'Please fix the email address before continuing.');
  });

  it('calls signInWithEmail on successful submission', async () => {
    await render(<LoginScreen />);
    (AuthService.signInWithEmail as jest.Mock).mockResolvedValueOnce({ error: null });
    
    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'password123');
    fireEvent.press(screen.getByText('Sign In'));
    
    await waitFor(() => {
      expect(AuthService.signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(dispatchMock).toHaveBeenCalledWith(completeOnboarding());
    });
  });

  it('shows alert on email sign in failure', async () => {
    await render(<LoginScreen />);
    (AuthService.signInWithEmail as jest.Mock).mockResolvedValueOnce({ error: 'Auth failed' });
    
    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'password123');
    fireEvent.press(screen.getByText('Sign In'));
    
    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith('Login Failed', 'Auth failed');
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });

  it('calls signInWithGoogle on google button press', async () => {
    await render(<LoginScreen />);
    (AuthService.signInWithGoogle as jest.Mock).mockResolvedValueOnce({ error: null });
    
    fireEvent.press(screen.getByText('Sign in with Google'));
    
    await waitFor(() => {
      expect(AuthService.signInWithGoogle).toHaveBeenCalled();
      expect(dispatchMock).toHaveBeenCalledWith(completeOnboarding());
    });
  });
  
  it('shows alert on google sign in failure', async () => {
    await render(<LoginScreen />);
    (AuthService.signInWithGoogle as jest.Mock).mockResolvedValueOnce({ error: 'Google failed' });
    
    fireEvent.press(screen.getByText('Sign in with Google'));
    
    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith('Google Sign-In Failed', 'Google failed');
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });
});
