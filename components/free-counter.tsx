'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface FreeCounterProps {
  userApiCount: number;
}

export const FreeCounter = ({ userApiCount = 0 }: FreeCounterProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>{userApiCount} / 5 Free Generations</p>
            {/* <p>{updatedUserApiCount} / 5 Free Generations</p> */}

            <Progress className="h-3" value={(userApiCount / 5) * 100} />
            <p>Resets after 1 minute!</p>
          </div>
          <Button className="w-full" variant="premium">
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
