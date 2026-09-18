import type { Component } from 'vue';

export const tabErrorIndication = String.fromCharCode(10071);

export interface ITabs {
  [k: string]: ITab;
}

export interface ITab {
  index: number;
  label: string;
  id: string;
  invalid: boolean;
  hidden?: boolean;
  class?: string;
  component: Component;
}

export interface TabValidation {
  valid: boolean;
  message?: string;
}

export type ITabComponent = Component & {
  validate?: () => Promise<TabValidation>;
  reset?: () => Promise<void>;
};
