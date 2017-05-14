import test from 'ava';
import React from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server';

import Mark from '../src/index';

test('happy case', t => {
    const result = render(<Mark styles={{'*': {color: 'red'}}}>*bold*</Mark>);
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

test('readme styles example', t => {
    const str = '*bold* _underline_ ~strike~ `code`';
    const custom = {
        '*': {fontStyle: 'italic'},
        '~': {color: 'red'},
        '`': {fontFamily: 'script'},
        '_': {color: 'green'},
    };
    const result = render(<Mark styles={custom}>{str}</Mark>);
    const expected =
        '<div><span style="font-style:italic;">bold</span> ' +
        '<span style="color:green;">underline</span> ' +
        '<span style="color:red;">strike</span> ' +
        '<span style="font-family:script;">code</span></div>';
    t.is(result, expected);
});
