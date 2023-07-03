export interface IWizardProps {
  steps: IStep[];
  allowBarNavigation?: boolean;
}

export interface IStep {
  name: string;
  valid: boolean;
}
