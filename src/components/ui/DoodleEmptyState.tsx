import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DoodleLostPlant, 
  DoodleMagnifierSprout, 
  DoodleSunnyCloud, 
  DoodleWateringCan 
} from '@/components/ui/BotanicalDoodles';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export type DoodleType = 'lost-plant' | 'magnifier' | 'sun-cloud' | 'watering-can';

interface DoodleEmptyStateProps {
  type?: DoodleType;
  badgeText?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const DoodleEmptyState: React.FC<DoodleEmptyStateProps> = ({
  type = 'lost-plant',
  badgeText = "Botanical Discovery",
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = ""
}) => {
  const renderDoodle = () => {
    switch (type) {
      case 'magnifier':
        return <DoodleMagnifierSprout className="w-36 h-36 sm:w-44 sm:h-44 mx-auto drop-shadow-[0_0_25px_rgba(45,212,191,0.3)]" />;
      case 'sun-cloud':
        return <DoodleSunnyCloud className="w-36 h-36 sm:w-44 sm:h-44 mx-auto drop-shadow-[0_0_25px_rgba(251,191,36,0.25)]" />;
      case 'watering-can':
        return <DoodleWateringCan className="w-36 h-36 sm:w-44 sm:h-44 mx-auto drop-shadow-[0_0_25px_rgba(45,212,191,0.3)]" />;
      case 'lost-plant':
      default:
        return <DoodleLostPlant className="w-40 h-40 sm:w-52 sm:h-52 mx-auto drop-shadow-[0_0_30px_rgba(45,212,191,0.35)]" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative p-8 sm:p-12 rounded-3xl bg-black/45 backdrop-blur-2xl border border-white/15 text-center overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.1)] ${className}`}
    >
      {/* Ambient background volumetric glow */}
      <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#2DD4BF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Doodle Illustration Stage */}
      <div className="relative mb-6 flex items-center justify-center">
        {renderDoodle()}
      </div>

      {/* Content Text Block */}
      <div className="max-w-md mx-auto space-y-3 relative z-10">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#5EEAD4] text-xs font-mono">
            <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{badgeText}</span>
          </div>
        )}

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {title}
        </h3>

        <p className="text-sm text-foreground/75 leading-relaxed">
          {description}
        </p>

        {/* Action Buttons */}
        {(actionText || secondaryActionText) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {actionText && onAction && (
              <Button
                onClick={onAction}
                className="w-full sm:w-auto bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] text-black font-extrabold px-6 py-5 rounded-full shadow-[0_0_25px_rgba(45,212,191,0.4)] transition-all hover:scale-105"
              >
                <span>{actionText}</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            )}

            {secondaryActionText && onSecondaryAction && (
              <Button
                variant="outline"
                onClick={onSecondaryAction}
                className="w-full sm:w-auto bg-black/40 hover:bg-white/10 text-white border-white/20 hover:border-[#2DD4BF]/50 rounded-full px-5 py-5"
              >
                <RotateCcw className="h-4 w-4 mr-1.5 text-[#5EEAD4]" />
                <span>{secondaryActionText}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
