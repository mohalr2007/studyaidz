import { GraduationCap } from 'lucide-react';
import { ImageResponse } from 'next/server';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4f7a9a', // A blue color similar to primary
        }}
      >
        <GraduationCap />
      </div>
    ),
    {
      ...size,
    }
  );
}
