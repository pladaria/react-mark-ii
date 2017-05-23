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
 * @param {string[]} marks - list of marks
 * @param {Object} options - options for marks
 * @return {Node}
 */
const parse = (str, marks, options) => {
    const breaks = PUNCTUATION + marks + SPACE;
    const ast = createNode('', null); // root node
    let node = createNode('', ast); // current node
    ast.children.push(node);

    const opens = (p, n) => (!p || breaks.includes(p)) && !SPACE.includes(n);
    const closes = (n) => (!n || breaks.includes(n));

    let i, j, c, n, p, len = 0, tmp, par, mark = '', stack = [];
    for (i = 0, len = str.length; i < len;) {
        c = str[i]; // current
        p = str[i - 1]; // previous
        if (c === '\n') {
            stack = stack.filter(m => options[m].multiline);
        } else {
            // the following for loop is equivalent to:
            // mark = marks.find(m => m === str.substr(i, m.length));
            for (mark = '', j = 0, tmp = marks[0]; j < marks.length; tmp = marks[++j]) {
                if (c === tmp[0] && tmp === str.substr(i, tmp.length)) {
                    mark = tmp;
                    break;
                }
            }
            if (mark) {
                n = str[i + mark.length]; // next
                if (closes(n) && stack.includes(mark)) {
                    while (stack.length) {
                        node = node.parent;
                        if (stack.pop() === mark) {
                            node.closed = true;
                            par = node.parent;
                            node = createNode('', par);
                            par.children.push(node);
                            break;
                        }
                    }
                    i += mark.length;
                    continue;
                }
                if (opens(p, n) && !stack.includes(mark)) {
                    stack.push(mark);
                    par = node.parent;
                    tmp = createNode(mark, par);
                    par.children.push(tmp);
                    node = createNode('', tmp);
                    tmp.children.push(node);
                    i += mark.length;
                    continue;
                }
            }
        }
        node.text += c;
        i++;
    }
    return ast;
};

exports.parse = parse;
