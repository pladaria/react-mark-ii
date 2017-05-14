const React = require('react');
const {parse} = require('./parser');

const DEFAULT_STYLES = {
    '*': {fontWeight: 'bold'},
    '_': {textDecoration:'underline'},
    '~': {textDecoration: 'line-through'},
    '`': {fontFamily: 'monospace', background: '#ddd'},
};

const render = (node, styles, raw = false) => {
    const t = node.type;
    const join = (raw) => node.children.map(n => render(n, styles, raw));
    if (t && node.closed) {
        if (t === '`') {
            return <span style={styles[t]}>{join(true)}</span>;
        }
        return raw ? [t, join(raw), t] : <span style={styles[t]}>{join(raw)}</span>;
    }
    return [node.text, t, join(raw)].filter(Boolean);
};

const Mark = ({
    children,
    styles = {},
    marks,
}) => {
    const elements = React.Children.toArray(children);
    const [str = ''] = elements;

    if (process.env.NODE_ENV !== 'production') {
        if (elements.length !== 1) {
            throw Error('One child of type string is required');
        }
        if (typeof str !== 'string') {
            throw Error('The only child of the Mark component must be a string');
        }
    }

    return <div>{render(parse(str, marks), Object.assign({}, DEFAULT_STYLES, styles))}</div>;
};

export default Mark;
