const SPACE = '\n\r\t ';
const PUNCTUATION = ',.;:?!()[]{}/-"\'';

/**
 * @typedef {Object} MarkNode
 * @property {string} type
 * @property {MarkNode} parent
 * @property {boolean} closed
 * @property {string} text
 * @property {MarkNode[]} children
 */

/**
 * @typedef {Object} MarkDef
 * @property {string} renderer
 * @property {boolean} raw
 * @property {boolean} multiline
 * @property {boolean} alwaysOpen
 */

/**
 * @param {string} type - Mark type
 * @param {MarkNode} parent - Reference to parent node
 * @return {MarkNode}
 */
const createNode = (type, parent) =>
    ({type, parent, closed: false, text: '', children: []});

/**
 * @param {string} str
 * @param {string[]} marks
 * @param {number} position
 */
const getMarkAt = (str, marks, position) => {
    // the following for loop is equivalent to:
    // mark = marks.find(m => m === str.substr(i, m.length));
    for (let j = 0, c = str[position], mark = marks[0]; j < marks.length; mark = marks[++j]) {
        if (c === mark[0] && mark === str.substr(position, mark.length)) {
            return mark;
        }
    }
    return '';
};

/**
 * @param {string} str - String to parse
 * @param {string[]} marks - list of marks
 * @param {Object<string, MarkDef>} options - options for marks
 * @return {MarkNode}
 */
const parse = (str, marks, options) => {
    const breaks = [...PUNCTUATION, ...marks, ...SPACE];

    const ast = createNode('', null); // root node
    let node = createNode('', ast); // current node
    ast.children.push(node);

    let stack = [];
    let wasMark = false;

    /**
     * @param {MarkDef} markDef - mark definition
     * @param {string} p - Previous char
     * @param {string} n - Next char
     */
    const opens = (markDef, p, n) =>
        markDef.alwaysOpen
        || ((!p || SPACE.includes(p) || wasMark) && !SPACE.includes(n));

    /**
     * @param {string} n - Next char
     */
    const closes = (n) => (!n || breaks.includes(n));

    let i, j, char, next, prev = '', len = 0, tmp, par, mark = '';
    for (i = 0, len = str.length; i < len;) {
        char = str[i];
        if (char === '\n') {
            // remove all non-multiline marks from stack
            stack = stack.filter(m => options[m].multiline);
        } else {
            mark = getMarkAt(str, marks, i);
            if (mark) {
                j = i + mark.length;
                next = getMarkAt(str, marks, j) || str[j];
                if (closes(next) && stack.includes(mark)) {
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
                    i = j;
                    prev = mark;
                    wasMark = true;
                    continue;
                }
                if (opens(options[mark], prev, next) && !stack.includes(mark)) {
                    stack.push(mark);
                    par = node.parent;
                    tmp = createNode(mark, par);
                    par.children.push(tmp);
                    node = createNode('', tmp);
                    tmp.children.push(node);
                    i = j;
                    prev = mark;
                    wasMark = true;
                    continue;
                }
            }
        }
        wasMark = false;
        node.text += char;
        prev = char;
        i++;
    }
    return ast;
};

exports.parse = parse;
