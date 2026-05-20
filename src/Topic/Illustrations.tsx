import React from "react";
import * as Kawaiis from "react-kawaii";

type KawaiiType = React.ComponentType<Kawaiis.KawaiiProps>;

interface Props {
  color: string;
  type: string;
  hasError?: boolean;
  isLoading?: boolean;
  size?: number;
}

function IllustrationInner({
  color,
  type,
  hasError = false,
  isLoading = false,
  size = 120,
}: Props) {
  const heightStyle = { height: `${size}px`, lineHeight: 0 };

  let mood: Kawaiis.KawaiiMood = "happy";
  if (isLoading) mood = "sad"; // cause this is cute!
  if (hasError) mood = "ko";

  const Kawaii = (Kawaiis as Record<string, KawaiiType>)[type];
  if (!Kawaii) return null;
  return (
    <div style={heightStyle}>
      <Kawaii size={size} mood={mood} color={color} />
    </div>
  );
}

export const Illustration = React.memo(IllustrationInner);
