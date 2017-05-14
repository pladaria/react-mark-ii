<p align="center">
<img width="90%" src="./logo.png" alt="react-mark-ii"/>
</p>
<h1 align="center">react-mark-ii</h1>
<p align="center">
Ultra small and fast text formatter for React
</p>
<p align="center">
<a href="https://travis-ci.org/pladaria/react-mark-ii"><img src="https://travis-ci.org/pladaria/react-mark-ii.svg" alt="Build Status"/></a>
<a href='https://coveralls.io/github/pladaria/react-mark-ii?branch=master'><img src='https://coveralls.io/repos/github/pladaria/react-mark-ii/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

## Features

  - Very small! (parser and renderer are just 50 lines of code)
  - Fast!
  - Dependency free
  - Configurable

## Live demo

[Demo!](https://runkit.com/pladaria/react-mark-ii-demo)

## Install

    npm install --save react-mark-ii

## Simple example

```javascript
import Mark from 'react-mark-ii';
//...
const str = '*bold* _underline_ ~strike~ `code`';
//...
<Mark>{str}</Mark>
```

Render result:

``` html
<div>
  <strong>bold</strong>
  <ins>underline</ins>
  <del>strike</del>
  <code>code</code>
</div>
```

## Custom renderers

With the `renderers` prop you can define the React component or tag name string that will render a specific mark:

```javascript
import Mark from 'react-mark-ii';
//...
const myRenderers = {
    '*': 'b',
    '_': 'u',
    '~': ({children}) => <span style={{color: 'red'}}>{children}</span>,
    '`': 'kbd',
};

const str = '*bold* _underline_ ~strike~ `code`';
//...
<Mark renderers={myRenderers}>{str}</Mark>
```

Render result:

```html
<div>
  <b>bold</b>
  <u>underline</u>
  <span style="color:red;">strike</span>
  <kbd>code</kbd>
</div>
```

## Custom marks

With the `marks` prop you can define your own format marks (for now they must be single chars):

```javascript
import Mark from 'react-mark-ii';
//...
const myRenderers = {
    '^': 'sup', // superscript
    '+': 'strong', // bold
};
const myMarks = '^+';
const str = '^superscript^ +bold text+';
//...
<Mark marks={myMarks} renderers={myRenderers}>{str}</Mark>
```

Render result:

```html
<div>
  <sup>superscript</sup>
  <strong>bold text</strong>
</div>
```

## License

MIT

Logo font is [Armed Lighting](http://www.iconian.com/a.html) from Dan Zadorozny
