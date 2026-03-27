export interface Soundscape {
  id: string;
  title: string;
  description: string;
  audioUri: string;
  imageUri: string;
}

export const SOUNDSCAPES: Soundscape[] = [
  {
    id: 'kyoto_rain',
    title: 'Kyoto Rain',
    description: 'Soft rain on a temple roof',
    // Rain Inside House
    audioUri: 'https://soundbible.com/grab.php?id=2011&type=mp3', 
    // Keeping the original image as requested to "restore" Kyoto Rain visual
    imageUri: 'https://r2-pub.rork.com/generated-images/15396d4b-6178-4492-8350-1e2f3a2f7326.png',
  },
  {
    id: 'ocean_bigsur',
    title: 'Big Sur',
    description: 'Peaceful waves crashing at sunset',
    // Crisp Ocean Waves
    audioUri: 'https://soundbible.com/grab.php?id=1936&type=mp3',
    // New vertical photorealistic sunset image
    imageUri: 'https://r2-pub.rork.com/generated-images/9af76d5c-b9cd-4683-8dc3-cb521008de03.png',
  },
  {
    id: 'forest_night',
    title: 'Forest at Night',
    description: 'Peaceful night sounds in the forest',
    // Crickets Chirping At Night (Verified ID 2083)
    audioUri: 'https://soundbible.com/grab.php?id=2083&type=mp3',
    // New vertical photorealistic forest night image - Keeping image as it might be appropriate, or I should rename it?
    // User said "find a sound that matches the stream".
    // I will assume the image is fine (it's generated) but the text and audio need to match "stream_alpine".
    imageUri: 'https://r2-pub.rork.com/generated-images/da480e62-07d6-4d2c-8cd4-3b4b4b6cdfef.png',
  },
  {
    id: 'thunder_storm',
    title: 'Thunder',
    description: 'Dramatic thunderstorm with lightning',
    // Perfect Thunder Storm
    audioUri: 'https://soundbible.com/grab.php?id=916&type=mp3',
    // New vertical photorealistic thunderstorm image
    imageUri: 'https://r2-pub.rork.com/generated-images/16ac35ca-780e-4899-aec7-e23237acb432.png',
  },
  {
    id: 'colorado_stream',
    title: 'Colorado Stream',
    description: 'Mountain stream in the Rockies',
    // Babbling Brook (gentle stream water)
    audioUri: 'https://soundbible.com/grab.php?id=1776&type=mp3',
    // Vertical photorealistic Colorado Rockies mountain stream with fall foliage
    imageUri: 'https://r2-pub.rork.com/generated-images/7e258e0a-2854-40b5-bdbb-ccf2e0a31e01.png',
  },
];
