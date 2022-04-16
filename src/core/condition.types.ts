
export const ConditionTypes = {
    constant: 'Constant',
    variable: 'Variable',
    or: 'Or',
    and: 'And'
}

export type ConditionType = 'Constant' | 'Variable' | 'Or' | 'And' | '';

export interface ICondition {
    evaluate(): boolean;
}
