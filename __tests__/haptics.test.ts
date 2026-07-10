import { triggerHaptic } from '../src/core/utils/haptics';
import * as Haptics from 'expo-haptics';
import { store } from '../src/core/store/store';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: 'light'
  },
  NotificationFeedbackType: {
    Success: 'success',
    Error: 'error'
  }
}));

// Mock store
jest.mock('../src/core/store/store', () => ({
  store: {
    getState: jest.fn()
  }
}));

describe('haptics utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('triggerHaptic', () => {
    it('should trigger light haptic when enabled in settings', () => {
      (store.getState as jest.Mock).mockReturnValue({
        settings: { hapticsEnabled: true }
      });

      triggerHaptic.light();

      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('should not trigger light haptic when disabled in settings', () => {
      (store.getState as jest.Mock).mockReturnValue({
        settings: { hapticsEnabled: false }
      });

      triggerHaptic.light();

      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('should trigger success haptic when enabled', () => {
      (store.getState as jest.Mock).mockReturnValue({
        settings: { hapticsEnabled: true }
      });

      triggerHaptic.success();

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);
    });

    it('should not trigger success haptic when disabled', () => {
      (store.getState as jest.Mock).mockReturnValue({
        settings: { hapticsEnabled: false }
      });

      triggerHaptic.success();

      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });

    it('should trigger error haptic when enabled', () => {
      (store.getState as jest.Mock).mockReturnValue({
        settings: { hapticsEnabled: true }
      });

      triggerHaptic.error();

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Error);
    });

    it('should not trigger error haptic when disabled', () => {
      (store.getState as jest.Mock).mockReturnValue({
        settings: { hapticsEnabled: false }
      });

      triggerHaptic.error();

      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });
  });
});
