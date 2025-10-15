export interface InitializationStep {
  condition: () => boolean;
  action: () => Promise<void>;
  name: string;
}

export interface WatcherConfig<T> {
  source: () => T;
  resetLevel?: 'gewest' | 'provincie' | 'gemeente' | 'straat' | 'huisnummer';
  initializeAction?: () => Promise<void>;
  skipWhen?: () => boolean;
  onValueChange?: (newValue: T, oldValue: T | undefined) => void;
  shouldInitialize?: (newValue: T) => boolean;
}

export type ResetLevel = 'gewest' | 'provincie' | 'gemeente' | 'straat' | 'huisnummer';
