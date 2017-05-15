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

const traverse = (children, marks, renderers) => React.Children.map(children, child => {
    if (React.isValidElement(child)) {
        return React.cloneElement(child, {}, ...traverse(child.props.children));
    }
    if (typeof child === 'string') {
        return render(parse(child, marks), {...DEFAULT_RENDERERS, ...renderers});
    }
    return child;
});

const Mark = ({
    children,
    renderers = {},
    marks,
    wrap = 'div',
    ...rest
}) => React.Children.count(children)
    ? React.createElement(wrap, rest, traverse(children, marks, {...DEFAULT_RENDERERS, ...renderers}))
    : null;

export default Mark;
