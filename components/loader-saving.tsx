import Image from 'next/image';
import { jellyTriangle } from 'ldrs';

jellyTriangle.register();

export const LoaderSaving = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      {/* <div className="w-10 h-10 relative animate-spin">
        <Image alt="logo" fill src="/logo.png" />
        
      </div> */}
      <div className="w-10 h-10 relative">
        <l-jelly-triangle
          size="30"
          speed="1.75"
          color="black"
        ></l-jelly-triangle>{' '}
      </div>

      <p className="text-sm text-muted-foreground">Saving chat...</p>
    </div>
  );
};
