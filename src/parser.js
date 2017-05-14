const MARKS = '_~*`';
const SPACE = '\n\r\t ';
const PUNCTUATION = ',.;:';

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
 * @param {boolean} [closed] - True if this node is properly closed
 * @return {Node}
 */
const createNode = (type, parent) =>
    ({type, parent, closed: false, text: '', children: []});

/**
 * @param {string} str
 * @return {Node}
 */
const parse = (str, marks = MARKS) => {
    const breaks = PUNCTUATION + MARKS + SPACE;
    const ast = createNode('', null); // root node
    let node = createNode('', ast); // current node
    ast.children.push(node);

    const opens = (p, n) => (!p || breaks.includes(p)) && !SPACE.includes(n);
    const closes = (n) => (!n || breaks.includes(n));

    let c, n, p, tmp, par, stack = [];
    for (let i = 0, len = str.length; i < len; i++) {
        p = str[i - 1]; // previous
        c = str[i];     // current
        n = str[i + 1]; // next
        if (marks.includes(c)) {
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
