type VariableKeyValue = {
    // title of the variable (e.g. --xxx)
    title: string;
    // selector (e.g. :root, html[data-theme='dark'])
    selector: string;
    // variable key (e.g. default, [xxx])
    key: "default" | (string & {});
    // variable value (e.g. #fff, #000)
    value: string;
};

type Variables = {
    // ID of the variables
    id: string;
    // The key value pairs
    keyValues: VariableKeyValue[];
};

export type { VariableKeyValue, Variables };
