import { Fragment, useState } from "react";
import { ConditionType, ConditionTypes } from "../core/condition.types";
import { BuilderService, Condition } from "../services/builder.service";
import { AppButton, Dropdown, DropdownBoolean } from "./shared.components";

/* --------------------------------- PUBLIC --------------------------------- */
export function ConditionBuilderRoot() {
    const serv = BuilderService.getInstance();

    return (
        <ConditionRecursiveTree itemsRoot={serv.conditions} />
    )
}

/* --------------------------------- PRIVATE -------------------------------- */
interface ConditionRecursiveTreeProps {
    readonly itemsRoot: Condition[]
}

const ConditionRecursiveTree = ({ 
    itemsRoot: itemsRoot 
}: ConditionRecursiveTreeProps) => {
    const createTree = (item: Condition) => {

        const children = item.conditions.map((x: Condition) => {
            return <Fragment key={x.id}>{createTree(x)}</Fragment>
        })

        return (
            <ConditionTreeItem
                key={item.id}
                condition={item}
            >
                {children}
            </ConditionTreeItem>
        )
    }

    return (
        <ul>
            {itemsRoot.map((x: Condition, i: any) => (
                <div key={i}>{createTree(x)}</div>
            ))}
        </ul>
    )
}

interface TreeItemProps {
    readonly condition: Condition
    readonly children: ReadonlyArray<JSX.Element>
}

const ConditionTreeItem = ({
    condition: condition,
    children,
}: TreeItemProps) => {
    const serv = BuilderService.getInstance();

    const argsLabels = serv.args.map(x => x.label)
    const [arg, setArg] = useState(serv.args.find(x => x.label === argsLabels[0]))

    const onAddBtnClick = () => { 
        serv.addCondition(condition);
    }
    const onTypeSelectorChange = (newValue: string) => {
        serv.updateCondtionType(condition, newValue as ConditionType)
    }
    const onDeleteBtnClick = () => {
        serv.clearCondition(condition)
    }
    const onSingleConstantChange = (newValue: boolean) => {
        serv.updateSingleValue(condition, newValue)
    }
    const onSingleVariableChange = (newArg: string) => {
        const ag = serv.args.find(x => x.label === newArg)!
        setArg(ag)
        serv.updateVariableValue(condition, ag);
    }

    // could be converted to another components
    const getConditionValueElement = () => {
        if (condition.type == 'Constant') {
            return <DropdownBoolean value={condition.value!} onChange={onSingleConstantChange} />
        } else
            if (condition.type == 'Variable') {
                return <Dropdown items={argsLabels} value={arg?.label!} onChange={onSingleVariableChange} />
            }
        return <></>
    }

    return (
        <div>
            <li className="item">
                <Dropdown items={Object.values(ConditionTypes)} value={condition.type.toString()} isPlaceholder={true} onChange={onTypeSelectorChange} />
                <AppButton isVisible={condition.type != ''} onClick={onDeleteBtnClick} text='X' />
                {getConditionValueElement()}
            </li>
            {
                children.length > 0 && (
                    <ul>
                        {children}
                        <li><AppButton onClick={onAddBtnClick} text='Add con' /></li>
                    </ul>
                )
            }
        </div>
    )
}



