import type { Component } from 'vue';

export interface ITabView {
  id: string;
  label: string;
  component: Component;
}

export interface ITabContainerProps {
  tabs: ITabView[];
}
