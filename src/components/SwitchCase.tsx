import React, { ReactNode } from 'react';

interface CaseProps {
    when: any;
    children: ReactNode;
}

interface SwitchProps {
    condition: any;
    children: ReactNode;
}

const Switch: React.FC<SwitchProps> = ({ condition, children }) => {
    let matchedCase: any = null;

    React.Children.forEach(children, (child) => {
        if (!matchedCase && React.isValidElement<CaseProps>(child) && child.props.when === condition) {
            matchedCase = child as React.ReactElement<CaseProps>;
        }
    });

    return matchedCase ? matchedCase.props.children : null;
};

const Case: React.FC<CaseProps> = ({ when, children }) => children;

export { Switch, Case };