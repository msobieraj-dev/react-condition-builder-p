import { useState } from "react";

/* ---------------------------------- HOOKS --------------------------------- */
export function useManualUpdate() {
    console.log('dd');
    
    let [value, setState] = useState(true);
    return () => setState(!value);
}

/* ------------------------------- COMPONENTS ------------------------------- */
export function AppButton(props: {
    text: string
    isVisible?: boolean
    onClick: () => any
  }): JSX.Element {
    const visible = props.isVisible ?? true;
    return visible ? <button className='item' onClick={props.onClick}>{props.text}</button> : <></>;
  }

export function InputText(props: {
    value: string;
    onChange: (val: string) => any;
}) {
    const onChange = (e: any) => {
        e.preventDefault();
        const val = e.target.value;
        props.onChange(val);
    }

    return (
        <input className="item" type="text" value={props.value} onChange={onChange}/>
    )
}

// for simplicity accepts only key/title/value as string, can be upgrade to generic
export function Dropdown(props: {
    items: string[];
    value: string;
    isPlaceholder?: boolean;
    onChange: (newValue: string) => any;
}): JSX.Element {

    const onChange = (e: any): void => {
        let newVal = e.target.value;
        props.onChange(newVal);
    }

    const elements = [];
    if (props.isPlaceholder) {
        elements.push(<option key={''} value={''} disabled>Select...</option>);
    }
    props.items.forEach(x => {
        elements.push(<option key={x} value={x}>{x}</option>)
    })

    return (
        <select className='item' value={props.value} onChange={onChange}>
            {elements}
        </select>
    );
}

export function DropdownBoolean(props: {
    value: boolean;
    onChange: (newValue: boolean) => any;
}): JSX.Element {

    const onChange = (newVal: string): void => {
        props.onChange(newVal == 'true' ? true : false);
    }

    return (
        <Dropdown items={['true', 'false']} value={props.value.toString()} onChange={onChange} />
    );
}