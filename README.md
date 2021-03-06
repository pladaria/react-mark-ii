<p align="center">
<img width="90%" src="https://raw.githubusercontent.com/pladaria/react-mark-ii/master/logo.png" alt="react-mark-ii"/>
</p>
<p align="center">
<b>react-mark-ii</b><br/>
Ultra small and fast text formatter for React
</p>
<p align="center">
<a href="https://travis-ci.org/pladaria/react-mark-ii"><img src="https://travis-ci.org/pladaria/react-mark-ii.svg" alt="Build Status"/></a>
<a href='https://coveralls.io/github/pladaria/react-mark-ii?branch=master'><img src='https://coveralls.io/repos/github/pladaria/react-mark-ii/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

## Features

  - Very small (parser is just **50 lines of code**!)
  - Super fast!
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
const str = '*bold* _emphasis_ ~strike~ `code` ```code\nblock```';
//...
<Mark>{str}</Mark>
```

Render result:

``` html
<div>
  <strong>bold</strong>
  <em>emphasis</em>
  <del>strike</del>
  <code>code</code>
  <pre>
    code
    block
  </pre>
</div>
```

## Custom options

With the `options` prop you can define your own markup:

Available mark options:

  - `renderer`: _React component_ or _tag name string_
  - `raw`: (default `false`) if `true`, inner marks will be ignored (useful for code marks)
  - `multiline`: (default `false`) if `true` marks can be used across multiple lines
  - `alwaysOpen`: (default `false`) by default, marks must be set after a break character (space or punctuation) and
  joined to an alphanumeric string). With `alwaysOpen` set to `true` you can ignore these checks. This is useful, for
  example, for multiline code blocks which may contain spaces after the mark.

```javascript
import Mark from 'react-mark-ii';
//...
const options = {
    '**': {renderer: 'b'},
    '_': {renderer: 'u'},
    '~': {renderer: ({children}) => <span className="red">{children}</span>},
    '`': {renderer: 'kbd', raw: true},
    '```': {renderer: 'pre', raw: true, multiline: true, alwaysOpen: true},
};

const str = '**bold** _underline_ ~strike~ `code` ```code\nblock```';
//...
<Mark options={options}>{str}</Mark>
```

Render result:

```html
<div>
  <b>bold</b>
  <u>underline</u>
  <span class="red">strike</span>
  <kbd>code</kbd>
  <pre>
    code
    block
  </pre>
</div>
```

## Custom wrapper

By default your children will be wrapped with a `div`. Use the `wrap` prop to have a different wrapper. You can use a React component or a tag name string.

```javascript
<Mark wrap="span">*text*</Mark>
```

Render result:

```html
<span>
  <strong>text</strong>
</span>
```

## Other props

All other props are passed to the wrapper

```javascript
<Mark className="my-class" style={{background: '#ddd'}}>*text*</Mark>
```

Render result:

```html
<div class="my-class" style="background:#ddd;">
  <strong>text</strong>
</div>
```

## License

MIT

[Logo font](http://www.iconian.com/a.html)
