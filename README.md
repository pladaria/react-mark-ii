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
  <span style="font-weight:bold;">bold</span>
  <span style="text-decoration:underline;">underline</span>
  <span style="text-decoration:line-through;">strike</span>
  <span style="font-family:monospace;background:#ddd;">code</span>
</div>
```

## Custom styles

With the `styles` you can use custom styles

For example:
```javascript
import Mark from 'react-mark-ii';

//...

const custom = {
    '*': {fontStyle: 'italic'},
    '~': {color: 'red'},
    '`': {fontFamily: 'script'},
    '_': {color: 'green'},
};

const str = '*bold* _underline_ ~strike~ `code`';

<Mark styles={custom}>{str}</Mark>
```

Render result:

```html
<div>
  <span style="font-style:italic;">bold</span>
  <span style="color:green;">underline</span>
  <span style="color:red;">strike</span>
  <span style="font-family:script;">code</span>
</div>
```

## License

MIT

Logo font is [Armed Lighting](http://www.iconian.com/a.html) from Dan Zadorozny
