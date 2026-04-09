import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'

export interface CapturedPhoto {
  dataUrl: string   // for display
  localUri: string  // saved path for persistence
}

/**
 * Capture a photo from camera or library.
 * Falls back to file input on web (for development).
 */
export async function capturePhoto(source: 'camera' | 'library'): Promise<CapturedPhoto | null> {
  try {
    const photo = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
    })

    if (!photo.base64String) return null

    const dataUrl = `data:image/jpeg;base64,${photo.base64String}`
    const fileName = `rms-${Date.now()}.jpg`

    // Save to device filesystem for persistence
    await Filesystem.writeFile({
      path: fileName,
      data: photo.base64String,
      directory: Directory.Data,
    })

    const { uri } = await Filesystem.getUri({
      path: fileName,
      directory: Directory.Data,
    })

    return { dataUrl, localUri: uri }
  } catch (err) {
    // User cancelled or permission denied
    console.warn('Camera capture cancelled or failed:', err)
    return null
  }
}

/**
 * Read a saved photo back as a data URL for display.
 */
export async function readPhotoAsDataUrl(localUri: string): Promise<string> {
  try {
    // If it's already a data URL or http URL, return as-is
    if (localUri.startsWith('data:') || localUri.startsWith('http')) {
      return localUri
    }
    const fileName = localUri.split('/').pop() ?? localUri
    const result = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Data,
    })
    const data = typeof result.data === 'string' ? result.data : ''
    return `data:image/jpeg;base64,${data}`
  } catch {
    return localUri
  }
}
