import { IToast } from '@models/toast';

export interface IWizardProps {
  steps: IStep[];
  allowBarNavigation?: boolean;
  disableSubmitWhenInvalid?: boolean;
}

export interface IStep {
  name: string;
  validate: () => Promise<{ valid: boolean; error?: IToast }>;
  nextStepDisabled?: boolean;
}
