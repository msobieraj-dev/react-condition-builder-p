import { ConditionType } from '../core/condition.types';

var idCount: number = 1
export function getNewId(): string {
    return (idCount++).toString()
}

/* --------------------------------- MODELS --------------------------------- */
export interface Condition {
    readonly id: string
    type: ConditionType
    value?: boolean
    evaluateFunc?: (con: Condition) => boolean | null
    conditions: Condition[]
}
export interface Arg {
    label: string
    value: boolean
}

/* --------------------------------- SERVICE -------------------------------- */
export class BuilderService {

    public args: Arg[] // could be in dedicated service 
    public conditions: Condition[]

    public refreshFunc?: () => void

    private constructor() {
        this.conditions = [
            {
                id: getNewId(),
                type: '',
                conditions: []
            }
        ]
        this.args = [
            { label: 'arg1', value: true },
            { label: 'param2', value: false },
        ]
    }

    // ARGS
    public addArg(arg: Arg): void {
        this.args.push(arg);
        this.refreshFunc!();
    }

    public updateArg(i: number, newArg: Arg): void {
        this.args[i].label = newArg.label
        this.args[i].value = newArg.value
        this.refreshFunc!()
    }

    // CONDITIONS
    public addCondition(con: Condition) {
        con.conditions.push(this.getNewCondition())
        this.refreshFunc!()
    }

    // this method could be update to follow one pattern, e.g: config[condType].get/seteverything about that type
    public updateCondtionType(con: Condition, newType: ConditionType) {
        this.clearCondition(con);

        con.type = newType;
        con.evaluateFunc = this.getEvaluateFunc(newType);

        if (newType == 'Constant') {
            con.value = true; // default
        } else
            if (newType == 'Variable') {
                con.evaluateFunc = (con) => { return this.args[0].value } // need refactor
            } else
                if (newType == 'Or' || newType == 'And') {
                    con.conditions.push(
                        this.getNewCondition(), this.getNewCondition()
                    )
                }

        this.refreshFunc!()
    }

    public clearCondition(con: Condition) {
        con.conditions = []
        con.type = ''
        delete con.evaluateFunc
        delete con.value
        this.refreshFunc!()
    }

    public updateSingleValue(con: Condition, newValue: boolean) {
        con.value = newValue
        this.refreshFunc!()
    }

    public updateVariableValue(con: Condition, arg: Arg) {
        con.evaluateFunc = (con) => { return arg.value }
        this.refreshFunc!()
    }

    private getEvaluateFunc(type: ConditionType): (con: Condition) => boolean | null {
        if (type == 'Constant') {
            return (con) => { return con.value! }
        } else
            if (type == 'Variable') {
                return (con) => { return con.value! } // not used, need refactor 
            } else
                if (type == 'Or') {
                    return (con) => {
                        const results = con.conditions.filter(x => x.evaluateFunc).map(x => x.evaluateFunc!(x))
                        return results.length > 0 ? results.includes(true) : null
                    }
                } else
                    if (type == 'And') {
                        return (con) => {
                            const results = con.conditions.filter(x => x.evaluateFunc).map(x => x.evaluateFunc!(x))
                            return results.length > 0 ? !results.includes(false) : null
                        }
                    }

        return (con) => { return null }
    }

    private getNewCondition(): Condition {
        return {
            id: getNewId(),
            type: '',
            conditions: [],
        }
    }

    /* -------------------------------- SINGLETON ------------------------------- */
    private static instance: BuilderService
    public static getInstance(): BuilderService {
        if (!BuilderService.instance) {
            BuilderService.instance = new BuilderService()
        }

        return BuilderService.instance;
    }
}