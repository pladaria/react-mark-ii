const React = require('react');
const {parse} = require('./parser');

const DEFAULT_OPTIONS = {
    '*': {renderer: 'strong', raw: false, multiline: false},
    '_': {renderer: 'em', raw: false, multiline: false},
    '~': {renderer: 'del', raw: false, multiline: false},
    '`': {renderer: 'code', raw: true, multiline: false},
    '```': {renderer: 'pre', raw: true, multiline: true},
};

/**
 * @param {Node} node
 * @param {Object} options
 * @param {boolean} raw -  if true, inner styles will be ignored
 * @param {number} key - React key
 * @return {React.Node}
 */
const render = (node, options, raw, key) => {
    const t = node.type;
    const join = (raw) => node.children.map((n, key) => render(n, options, raw, key));
    if (t && node.closed) {
        return raw
            ? [t, join(raw), t]
            : React.createElement(options[t].renderer, {key}, join(options[t].raw));
    }
    return [node.text, t, join(raw)];
};

const traverse = (children, marks, options) => React.Children.map(children, child => {
    if (React.isValidElement(child)) {
        return React.cloneElement(child, {}, traverse(child.props.children, marks, options));
    }
    if (typeof child === 'string') {
        return render(parse(child, marks, options), options, false, 0);
    }
    return child;
});

const Mark = ({
    wrap = 'div',
    options = DEFAULT_OPTIONS,
    children,
    ...rest
}) => {
    const marks = Object.keys(options).sort((k1, k2) => k2.length - k1.length);

    if (React.Children.count(children)) {
        return React.createElement(
            wrap,
            rest,
            traverse(children, marks, options)
        );
    }
    return null;
};

export default Mark;
