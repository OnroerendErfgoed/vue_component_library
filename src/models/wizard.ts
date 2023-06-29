export interface IWizardProps {
  steps: IStep[];
}

export interface IStep {
  name: string;
  valid?: boolean;
}
