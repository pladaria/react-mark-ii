const React = require('react');
const {parse} = require('./parser');

const DEFAULT_RENDERERS = {
    '*': 'strong',
    '_': 'em',
    '~': 'del',
    '`': 'code',
};

/**
 * @param {Node} node
 * @param {Object} renderers
 * @param {boolean} raw -  if true, inner styles will be ignored
 * @param {number} key - React key
 * @return {React.Node}
 */
const render = (node, renderers, raw, key) => {
    const t = node.type;
    const join = (raw) => node.children.map((n, key) => render(n, renderers, raw, key));
    if (t && node.closed) {
        if (t === '`') {
            return React.createElement(renderers[t], {key}, join(true));
        }
        return raw ? [t, join(raw), t] : React.createElement(renderers[t], {key}, join(raw));
    }
    return [node.text, t, join(raw)].filter(Boolean);
};

const traverse = (children, marks, renderers) => React.Children.map(children, child => {
    if (React.isValidElement(child)) {
        return React.cloneElement(child, {}, traverse(child.props.children, marks, renderers));
    }
    if (typeof child === 'string') {
        return render(parse(child, marks), renderers, false, 0);
    }
    return child;
});

const Mark = ({
    children,
    renderers = DEFAULT_RENDERERS,
    marks = '_~*`',
    wrap = 'div',
    ...rest
}) => React.Children.count(children)
    ? React.createElement(wrap, rest, traverse(children, marks, {...DEFAULT_RENDERERS, ...renderers}))
    : null;

export default Mark;
