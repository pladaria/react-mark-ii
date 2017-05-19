const SPACE = '\n\r\t ';
const PUNCTUATION = ',.;:?!()[]{}/-"\'';

/**
 * @typedef {Object} Node
 * @property {string} type
 * @property {Node} parent
 * @property {boolean} closed
 * @property {string} text
 * @property {Node[]} children
 */

/**
 * @param {string} type
 * @param {Node} parent - Reference to parent node
 * @return {Node}
 */
const createNode = (type, parent) =>
    ({type, parent, closed: false, text: '', children: []});

/**
 * @param {string} str - String to parse
 * @param {string} marks - Collection of marks (for now only single char marks are supported)
 * @return {Node}
 */
const parse = (str, marks) => {
    const breaks = PUNCTUATION + marks + SPACE;
    const ast = createNode('', null); // root node
    let node = createNode('', ast); // current node
    ast.children.push(node);

    const opens = (p, n) => (!p || breaks.includes(p)) && !SPACE.includes(n);
    const closes = (n) => (!n || breaks.includes(n));

    let c, n, p, tmp, par, stack = [];
    for (let i = 0, len = str.length; i < len; i++) {
        c = str[i];     // current
        p = str[i - 1]; // previous
        n = str[i + 1]; // next
        if (c === '\n') {
            stack = [];
        } else if (marks.includes(c)) {
            if (closes(n) && stack.includes(c)) {
                while (stack.length) {
                    node = node.parent;
                    if (stack.pop() === c) {
                        node.closed = true;
                        par = node.parent;
                        node = createNode('', par);
                        par.children.push(node);
                        break;
                    }
                }
                continue;
            }
            if (opens(p, n) && !stack.includes(c)) {
                stack.push(c);
                par = node.parent;
                tmp = createNode(c, par);
                par.children.push(tmp);
                node = createNode('', tmp);
                tmp.children.push(node);
                continue;
            }
        }
        node.text += c;
    }
    return ast;
};

exports.parse = parse;
