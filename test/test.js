import test from 'ava';
import React from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server';

import Mark from '../src/index';

test('happy case', t => {
    const result = render(<Mark marks="*" styles={{'*': {color: 'red'}}}>*bold*</Mark>);
    const expected = '<div><span style="color:red;">bold</span></div>';
    t.is(result, expected);
});

test('readme simple example', t => {
    const str = '*bold* _underline_ ~strike~ `code`';
    const result = render(<Mark>{str}</Mark>);
    const expected =
        '<div><span style="font-weight:bold;">bold</span> ' +
        '<span style="text-decoration:underline;">underline</span> ' +
        '<span style="text-decoration:line-through;">strike</span> ' +
        '<span style="font-family:monospace;background:#ddd;">code</span></div>';
    t.is(result, expected);
});

test('readme custom styles example', t => {
    const str = '*bold* _underline_ ~strike~ `code`';
    const myStyles = {
        '*': {fontStyle: 'italic'},
        '~': {color: 'red'},
        '`': {fontFamily: 'script'},
        '_': {color: 'green'},
    };
    const result = render(<Mark styles={myStyles}>{str}</Mark>);
    const expected =
        '<div><span style="font-style:italic;">bold</span> ' +
        '<span style="color:green;">underline</span> ' +
        '<span style="color:red;">strike</span> ' +
        '<span style="font-family:script;">code</span></div>';
    t.is(result, expected);
});

test('readme custom marks example', t => {
    const str = '^text^ +more text+';
    const myStyles = {
        '^': {color: 'blue'},
        '+': {color: 'red'},
    };
    const myMarks = '^+';
    const result = render(<Mark marks={myMarks} styles={myStyles}>{str}</Mark>);
    const expected =
        '<div><span style="color:blue;">text</span> ' +
        '<span style="color:red;">more text</span>' +
        '</div>';
    t.is(result, expected);
});

test('unclosed element', t => {
    const str = '*bold _under* line_';
    const result = render(<Mark>{str}</Mark>);
    const expected =
        '<div><span style="font-weight:bold;">bold _under</span> line_</div>';
    t.is(result, expected);
});

test('markup inside code tags is ignored', t => {
    const str = '`this _is_ *code*`';
    const result = render(<Mark>{str}</Mark>);
    const expected =
        '<div><span style="font-family:monospace;background:#ddd;">this _is_ *code*</span></div>';
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
