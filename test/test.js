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
    const str = '*bold* _emphasis_ ~strike~ `code`';
    const result = render(<Mark>{str}</Mark>);
    const expected =
        '<div><strong>bold</strong> ' +
        '<em>emphasis</em> ' +
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

test('nested children', t => {
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
    const result = render(<Mark>{children}</Mark>);
    const expected =
        '<div>' +
            '<span>' +
                '<strong>bold</strong>' +
                '<span style="color:red;">' +
                    '<em>emphasis</em>' +
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
