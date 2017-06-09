import test from 'ava';
import React from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server';

import Mark from '../src/index';

test('happy case', t => {
    const result = render(<Mark options={{'*': {renderer: 'b'}}}>*bold*</Mark>);
    const expected = '<div><b>bold</b></div>';
    t.is(result, expected);
});

test('readme simple example', t => {
    const str = '*bold* _emphasis_ ~strike~ `code` ```code block```';
    const result = render(<Mark>{str}</Mark>);
    const expected =
        '<div><strong>bold</strong> ' +
        '<em>emphasis</em> ' +
        '<del>strike</del> ' +
        '<code>code</code> ' +
        '<pre>code block</pre></div>';
    t.is(result, expected);
});

test('readme custom options example', t => {
    const options = {
        '**': {renderer: 'b'},
        '_': {renderer: 'u'},
        '~': {renderer: ({children}) => <span style={{color: 'red'}}>{children}</span>},
        '`': {renderer: 'kbd'},
        '```': {renderer: 'pre', raw: true, multiline: true},
    };
    const str = '**bold** _underline_ ~strike~ `code` ```code\nblock```';
    const result = render(<Mark options={options}>{str}</Mark>);
    const expected =
        '<div><b>bold</b> ' +
        '<u>underline</u> ' +
        '<span style="color:red;">strike</span> ' +
        '<kbd>code</kbd> ' +
        '<pre>code\nblock</pre></div>';
    t.is(result, expected);
});

test('readme custom wrapper example', t => {
    const result = render(<Mark wrap='span'>*text*</Mark>);
    const expected = '<span><strong>text</strong></span>';
    t.is(result, expected);
});

test('readme rest of props example', t => {
    const result = render(<Mark className="my-class" style={{background: '#ddd'}}>*text*</Mark>);
    const expected = '<div class="my-class" style="background:#ddd;"><strong>text</strong></div>';
    t.is(result, expected);
});

test('unclosed element', t => {
    const str = '*bold _under* line_';
    const result = render(<Mark>{str}</Mark>);
    const expected = '<div><strong>bold _under</strong> line_</div>';
    t.is(result, expected);
});

test('markup inside code tags is ignored', t => {
    const str = '`this _is_ *code*`';
    const result = render(<Mark>{str}</Mark>);
    const expected =
        '<div><code>this _is_ *code*</code></div>';
    t.is(result, expected);
});

test('markup inside code tags is ignored', t => {
    const str = '`this _is_ *code*`';
    const result = render(<Mark>{str}</Mark>);
    const expected =
        '<div><code>this _is_ *code*</code></div>';
    t.is(result, expected);
});

test('do not allow multiline styling', t => {
    const str = '*foo\nbar*';
    const result = render(<Mark>{str}</Mark>);
    const expected =
        '<div>*foo\nbar*</div>';
    t.is(result, expected);
});

test('nested children', t => {
    const options = {
        '_': {renderer: 'u'},
        '~': {renderer: 'del'},
        '*': {renderer: 'strong'},
        '`': {renderer: 'code'},
    };
    const children = (
        <span>
            *bold*
            <span style={{color: 'red'}}>
                _emphasis_
                <b>`code`</b>
                {null}
            </span>
            {['~strike~', null, undefined, '', 0, 123]}
        </span>
    );
    const result = render(<Mark options={options}>{children}</Mark>);
    const expected =
        '<div>' +
            '<span>' +
                '<strong>bold</strong>' +
                '<span style="color:red;">' +
                    '<u>emphasis</u>' +
                    '<b><code>code</code></b>' +
                '</span>' +
                '<del>strike</del>0123' +
            '</span>' +
        '</div>';
    t.is(result, expected);
});

test('no children', t => {
    const result = render(<Mark></Mark>);
    const expected = '';
    t.is(result, expected);
});

test('multichar marks', t => {
    const options = {
        '`': {renderer: 'code'},
        '*': {renderer: 'i'},
        '**': {renderer: 'b'},
        '```': {renderer: 'pre', raw: true},
    };
    const str = '**bold** `code` *italic* ```code block```';
    const result = render(<Mark options={options}>{str}</Mark>);
    const expected =
        '<div>' +
            '<b>bold</b> ' +
            '<code>code</code> ' +
            '<i>italic</i> ' +
            '<pre>code block</pre>' +
        '</div>';
    t.is(result, expected);
});

test('corner case joining code marks', t => {
    const str = '````wat?````';
    const result = render(<Mark>{str}</Mark>);
    const expected =
        '<div>' +
            '<pre>`wat?</pre>`' +
        '</div>';
    t.is(result, expected);
});

test('corner case combining style marks', t => {
    const options = {
        '*': {renderer: 'i'},
        '**': {renderer: 'b'},
    };
    const str = '***wat?***';
    const result = render(<Mark options={options}>{str}</Mark>);
    const expected =
        '<div>' +
            '<b>*wat?</b>*' +
        '</div>';
    t.is(result, expected);
});

test('marks inside url', t => {
    const options = {
        '_': {renderer: 'i'},
        '*': {renderer: 'b'},
    };
    const str = 'foo.bar/__baz__,*qux*(*bla*)';
    const result = render(<Mark options={options}>{str}</Mark>);
    const expected = '<div>foo.bar/__baz__,*qux*(*bla*)</div>';
    t.is(result, expected);
});

test('Marks inside markdown link', t => {
    const options = {
        '_': {renderer: 'i'},
        '*': {renderer: 'b'},
    };
    const str = '[foo.bar/__baz__,*qux*](*foo* _bar_)';
    const result = render(<Mark options={options}>{str}</Mark>);
    const expected = '<div>[foo.bar/__baz__,*qux*](*foo* <i>bar</i>)</div>';
    t.is(result, expected);
});

test('joined marks', t => {
    const options = {
        '_': {renderer: 'i'},
        '*': {renderer: 'b'},
    };
    const str = '*foo*_bar_';
    const result = render(<Mark options={options}>{str}</Mark>);
    const expected = '<div><b>foo</b><i>bar</i></div>';
    t.is(result, expected);
});
