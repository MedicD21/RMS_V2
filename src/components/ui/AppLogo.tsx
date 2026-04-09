import rmsIcon from "/RMS_AppIcon.png";

interface AppLogoProps {
  size?: number;
}

/**
 * App logo using the actual RMS_AppIcon.png.
 * Corner radius matches the iOS app icon spec (~22% of size).
 */
export function AppLogo({ size = 50 }: AppLogoProps) {
  return (
    <img
      src={rmsIcon}
      alt='Reset My Space'
      width={size}
      height={size}
      style={{
        borderRadius: Math.round(size * 0.22),
        flexShrink: 0,
        display: "flex",
      }}
    />
  );
}
