import test from 'ava';
import React from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server';

import Mark from '../src/index';

test('happy case', t => {
    const result = render(<Mark marks="*" renderers={{'*': 'b'}}>*bold*</Mark>);
    const expected = '<div><b>bold</b></div>';
    t.is(result, expected);
});

test('readme simple example', t => {
    const str = '*bold* _underline_ ~strike~ `code`';
    const result = render(<Mark>{str}</Mark>);
    const expected =
        '<div><strong>bold</strong> ' +
        '<ins>underline</ins> ' +
        '<del>strike</del> ' +
        '<code>code</code></div>';
    t.is(result, expected);
});

test('readme custom renderers example', t => {
    const str = '*bold* _underline_ ~strike~ `code`';
    const myRenderers = {
        '*': 'b',
        '_': 'u',
        '~': ({children}) => <span style={{color: 'red'}}>{children}</span>,
        '`': 'kbd',
    };
    const result = render(<Mark renderers={myRenderers}>{str}</Mark>);
    const expected =
        '<div><b>bold</b> ' +
        '<u>underline</u> ' +
        '<span style="color:red;">strike</span> ' +
        '<kbd>code</kbd></div>';
    t.is(result, expected);
});

test('readme custom marks example', t => {
    const myRenderers = {
        '^': 'sup', // superscript
        '+': 'strong', // bold
    };
    const myMarks = '^+';
    const str = '^superscript^ +bold text+';
    const result = render(<Mark marks={myMarks} renderers={myRenderers}>{str}</Mark>);
    const expected = '<div><sup>superscript</sup> <strong>bold text</strong></div>';
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

test('one single child is required', t => {
    t.throws(() => {
        render(<Mark />);
    });
    t.throws(() => {
        render(<Mark>{['s1', 's2']}</Mark>);
    });
});

test('child must be a string', t => {
    t.throws(() => {
        render(<Mark>{1}</Mark>);
    });
    t.throws(() => {
        render(<Mark>{[1]}</Mark>);
    });
    t.pass(render(<Mark>string</Mark>));
    t.pass(render(<Mark>{['string']}</Mark>));
});

test('do not throw in production', t => {
    const env = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    t.pass(render(<Mark />));
    t.pass(render(<Mark>{['s1', 's2']}</Mark>));
    process.env.NODE_ENV = env;
});
