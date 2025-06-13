import React from 'react';
import TrackList from './TrackList';
import type { TrackData } from '../types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaylistProps {
  playlistName: string;
  playlistTracks: TrackData[];
  onNameChange: (name: string) => void;
  onRemove: (track: TrackData) => void;
  onSave: () => void;
}

const Playlist: React.FC<PlaylistProps> = ({ playlistName, playlistTracks, onNameChange, onRemove, onSave }) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(event.target.value);
  };

  return (
    <Card className="w-full md:w-[450px]">
      <CardHeader>
        <CardTitle>My Playlist</CardTitle>
        <CardDescription>Name your playlist and add tracks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input 
          placeholder="Playlist Name" 
          value={playlistName} 
          onChange={handleNameChange} 
        />
        <TrackList tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onSave}>SAVE TO SPOTIFY</Button>
      </CardFooter>
    </Card>
  );
};

export default Playlist;
