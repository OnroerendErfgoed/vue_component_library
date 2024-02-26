export interface IWorkflow {
  actor: string;
  datum: string;
  state: IWorkflowState;
  owners: IWorkflowOwner[];
  actor_omschrijving: string;
}

export interface GridWorkflowProps {
  data: IWorkflow[];
  schema: ISaveState[];
}

export interface IWorkflowOwner {
  id: string;
  type: string;
  omschrijving: string;
}

export interface IWorkflowState {
  id: number;
  comment?: string;
}

interface ISaveState {
  description: string;
  id: number;
  next_states: INextState[];
  qualifiers: ISaveState[];
  tag: string;
}

interface INextState {
  id: number;
  qualifiers: { id: number }[];
}
