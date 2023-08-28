export interface IWizardProps {
  steps: IStep[];
  allowBarNavigation?: boolean;
  disableSubmitWhenInvalid?: boolean;
}

export interface IStep {
  name: string;
  validate: () => Promise<boolean>;
}
