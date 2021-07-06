export interface RiskRuleSet {
  approvedLimit: number;
  parameters: RiskParameter[];
}

export interface RiskParameter {
  active: boolean;
  code: string;
  name: string;
  variables: {
    [key: string]: unknown;
  };
}

export interface RiskModel {
  id: string;
  modelType: 'onboarding' | 'continuous';
  name: string;
  createdAt?: string;
  ruleSets: RiskRuleSet[];
}
