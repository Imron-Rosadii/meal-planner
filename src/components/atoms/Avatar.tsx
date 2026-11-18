import { useState } from "react";

type AvatarSize = "sm" | "md" | "lg" | "xl";

type AvatarColor = "green" | "blue" | "purple" | "orange" | "pink";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  color?: AvatarColor;
  isOnline?: boolean;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

const colorStyles: Record<AvatarColor, string> = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
  pink: "bg-pink-100 text-pink-700",
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "?";

  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function Avatar({
  src,
  name,
  size = "md",
  color = "pink",
  isOnline = false,
  className = "",
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const showImage = Boolean(src) && !imageError;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`} title={name}>
      {showImage ? (
        <img
          src={src!}
          alt={name}
          onError={() => setImageError(true)}
          className={`rounded-full object-cover ${sizeStyles[size]}`}
        />
      ) : (
        <div
          className={`
            inline-flex items-center justify-center
            rounded-full font-semibold
            ${sizeStyles[size]}
            ${colorStyles[color]}
          `}
          aria-label={name}
        >
          {getInitials(name)}
        </div>
      )}

      {isOnline && (
        <span
          className="
            absolute bottom-0 right-0
            h-3 w-3 rounded-full
            border-2 border-white bg-pink-500
          "
          aria-label="Online"
        />
      )}
    </div>
  );
}

export default Avatar;
