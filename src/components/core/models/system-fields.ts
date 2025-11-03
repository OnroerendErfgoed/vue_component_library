export interface ISystemFieldsProps {
  status?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ISystemFields {
  activated_at: string;
  activated_by: ISystemFieldsUser;
  created_at: string;
  created_by: ISystemFieldsUser;
  updated_at: string;
  updated_by: ISystemFieldsUser;
}

export interface ISystemFieldsUser {
  description: string;
  uri: string;
}
