import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { TrackData } from '../types';

interface TrackProps {
  track: TrackData;
  onAdd?: (track: TrackData) => void;
  onRemove?: (track: TrackData) => void;
  isRemoval?: boolean;
}

const Track: React.FC<TrackProps> = ({ track, onAdd, onRemove, isRemoval }) => {
  const addTrack = () => {
    if (onAdd) {
      onAdd(track);
    }
  };

  const removeTrack = () => {
    if (onRemove) {
      onRemove(track);
    }
  };

  return (
    <Card className="w-[350px] mb-4">
      <CardHeader>
        <CardTitle>{track.name}</CardTitle>
        <CardDescription>{track.artist} | {track.album}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Additional content can go here if needed */}
      </CardContent>
      <CardFooter className="flex justify-end">
        {isRemoval ? (
          <Button variant="outline" size="icon" onClick={removeTrack}>-</Button>
        ) : (
          <Button variant="outline" size="icon" onClick={addTrack}>+</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Track;
