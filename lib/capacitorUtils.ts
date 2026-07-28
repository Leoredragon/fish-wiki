import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

export const isNativeApp = () => Capacitor.isNativePlatform();

/**
 * Trigger subtle light haptic feedback (for tab taps, likes, button clicks)
 */
export const triggerHapticLight = async () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(35); } catch {}
  }
  if (!isNativeApp()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    try { await Haptics.vibrate({ duration: 35 }); } catch {}
  }
};

/**
 * Trigger medium haptic feedback (for submitting forms, creating stories/catches)
 */
export const triggerHapticMedium = async () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(60); } catch {}
  }
  if (!isNativeApp()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    try { await Haptics.vibrate({ duration: 60 }); } catch {}
  }
};

/**
 * Trigger notification success haptic feedback (for completed uploads)
 */
export const triggerHapticSuccess = async () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate([40, 30, 40]); } catch {}
  }
  if (!isNativeApp()) return;
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    try { await Haptics.vibrate({ duration: 80 }); } catch {}
  }
};

/**
 * Native Android Share Sheet for Image Files (PNG/JPEG)
 */
export const shareImageNative = async (base64DataUrl: string, title: string) => {
  console.log('[oltaApp Share] 1. shareImageNative triggered with title:', title);

  if (!isNativeApp()) {
    console.log('[oltaApp Share] Not native app');
    return false;
  }

  try {
    console.log('[oltaApp Share] 2. Extracting base64 image data...');
    const fileName = `oltaapp_catch_${Date.now()}.png`;
    const cleanBase64 = base64DataUrl.includes(',') ? base64DataUrl.split(',')[1] : base64DataUrl;

    console.log('[oltaApp Share] 3. Writing PNG to Filesystem Directory.Cache...');
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: cleanBase64,
      directory: Directory.Cache
    });

    console.log('[oltaApp Share] 4. File saved at URI:', savedFile.uri);

    console.log('[oltaApp Share] 5. Calling Share.share with file URI...');
    const result = await Share.share({
      title: title,
      text: 'oltaApp ile kaydedilen av kartı 🎣',
      url: savedFile.uri,
      dialogTitle: 'Av Kartını Paylaş (WhatsApp, Instagram...)'
    });

    console.log('[oltaApp Share] 6. Share result:', result);
    return true;
  } catch (err: any) {
    console.error('[oltaApp Share ERROR] Failed during native image share:', err?.message || err);
    return false;
  }
};

/**
 * Native Android Share Sheet with fallback for text/urls
 */
export const nativeShare = async (options: { title: string; text?: string; url?: string }) => {
  const shareUrl = options.url || (typeof window !== 'undefined' ? window.location.href : 'https://oltaapp.com');
  const shareText = options.text ? `${options.text}\n${shareUrl}` : `oltaApp'te bu içeriğe göz at: ${shareUrl}`;

  console.log('[oltaApp Share] Text/URL share triggered:', options.title);

  if (isNativeApp()) {
    try {
      await Share.share({
        title: options.title,
        text: shareText,
        url: shareUrl,
        dialogTitle: 'oltaApp Paylaş (WhatsApp, Instagram...)'
      });
      return true;
    } catch (e) {
      console.error('[oltaApp Share ERROR] Text share failed:', e);
    }
  }

  // Web Fallback
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: shareText,
        url: shareUrl
      });
      return true;
    } catch {
      // User cancelled
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`${shareText}`);
      return true;
    } catch (e) {
      console.error('[oltaApp Share ERROR] Clipboard write failed:', e);
    }
  }

  return false;
};

/**
 * Native Camera & Photo Picker returning a JavaScript File object
 */
export const pickPhotoNative = async (promptSource: 'camera' | 'photos' | 'prompt' = 'prompt'): Promise<File | null> => {
  if (!isNativeApp()) return null;

  try {
    const source = promptSource === 'camera' 
      ? CameraSource.Camera 
      : promptSource === 'photos' 
        ? CameraSource.Photos 
        : CameraSource.Prompt;

    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: source,
      correctOrientation: true
    });

    if (!photo.webPath) return null;

    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    const fileName = `oltaapp_photo_${Date.now()}.${photo.format || 'jpg'}`;

    return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
  } catch (e) {
    console.log('[pickPhotoNative] User cancelled or error:', e);
    return null;
  }
};

/**
 * Native GPS Geolocation getter with high accuracy fallback
 */
export const getCurrentPositionNative = async (): Promise<{ lat: number; lng: number } | null> => {
  if (isNativeApp()) {
    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        await Geolocation.requestPermissions();
      }
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3000
      });
      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch (e) {
      console.error('[getCurrentPositionNative ERROR]:', e);
    }
  }

  // Web Fallback
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000 }
    );
  });
};
