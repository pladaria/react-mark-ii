const React = require('react');
const {parse} = require('./parser');

const DEFAULT_RENDERERS = {
    '*': 'strong',
    '_': 'em',
    '~': 'del',
    '`': 'code',
};

const render = (node, renderers, raw = false) => {
    const t = node.type;
    const join = (raw) => node.children.map(n => render(n, renderers, raw));
    if (t && node.closed) {
        if (t === '`') {
            return React.createElement(renderers[t], {}, ...join(true));
        }
        return raw ? [t, join(raw), t] : React.createElement(renderers[t], {}, ...join(raw));
    }
    return [node.text, t, join(raw)].filter(Boolean);
};

const Mark = ({
    children,
    renderers = {},
    marks,
    ...rest
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

    return (
        <div {...rest}>
            {render(parse(str, marks), {...DEFAULT_RENDERERS, ...renderers})}
        </div>
    );
};

export default Mark;
