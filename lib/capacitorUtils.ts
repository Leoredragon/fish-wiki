import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Share } from '@capacitor/share';

export const isNativeApp = () => Capacitor.isNativePlatform();

/**
 * Trigger subtle light haptic feedback (for tab taps, likes, button clicks)
 */
export const triggerHapticLight = async () => {
  if (!isNativeApp()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {
    console.debug('Haptics error:', e);
  }
};

/**
 * Trigger medium haptic feedback (for submitting forms, creating stories/catches)
 */
export const triggerHapticMedium = async () => {
  if (!isNativeApp()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (e) {
    console.debug('Haptics error:', e);
  }
};

/**
 * Trigger notification success haptic feedback (for completed uploads)
 */
export const triggerHapticSuccess = async () => {
  if (!isNativeApp()) return;
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch (e) {
    console.debug('Haptics error:', e);
  }
};

/**
 * Native Android Share Sheet with fallback for web
 */
export const nativeShare = async (options: { title: string; text?: string; url?: string }) => {
  const shareUrl = options.url || (typeof window !== 'undefined' ? window.location.href : 'https://oltaapp.com');
  const shareText = options.text ? `${options.text}\n${shareUrl}` : `oltaApp'te bu içeriğe göz at: ${shareUrl}`;

  if (isNativeApp()) {
    try {
      await Share.share({
        title: options.title,
        text: shareText,
        url: shareUrl,
        dialogTitle: 'oltaApp Paylaş'
      });
      return true;
    } catch (e) {
      console.debug('Native Share error:', e);
    }
  }

  // Web Fallback (Desktop / Web Browser)
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: shareText,
        url: shareUrl
      });
      return true;
    } catch {
      // Ignore user abort
    }
  }

  // Clipboard fallback
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`${shareText}`);
      return true;
    } catch (e) {
      console.debug('Clipboard write error:', e);
    }
  }

  return false;
};
