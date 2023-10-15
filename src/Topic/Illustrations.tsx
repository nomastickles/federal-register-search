import React from "react";
import * as Kawaiis from "react-kawaii";

type KawaiiType = React.ComponentType<Kawaiis.KawaiiProps>;

function IllustrationInner({
  color,
  type,
  hasError,
  isLoading,
}: {
  color: string;
  type: string;
  hasError: boolean;
  isLoading: boolean;
}) {
  const size = 100;
  const heightStyle = { height: `${size}px` };

  let mood: Kawaiis.KawaiiMood = "happy";
  if (isLoading) mood = "sad"; // cause this is cute!
  if (hasError) mood = "ko";

  const Kawaii = (Kawaiis as Record<string, KawaiiType>)[type];
  return (
    <div style={heightStyle}>
      <Kawaii size={size} mood={mood} color={color} />
    </div>
  );
}

export const Illustration = React.memo(IllustrationInner);
