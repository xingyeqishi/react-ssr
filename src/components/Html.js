/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import initReactFastclick from 'react-fastclick';
// import s from './Html.css';

initReactFastclick();

/* eslint-disable react/no-danger */

class Html extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    styles: PropTypes.arrayOf(PropTypes.string.isRequired),
    scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
    appData: PropTypes.object, // eslint-disable-line
    children: PropTypes.string.isRequired,
  };

  static defaultProps = {
    styles: [],
    scripts: [],
    description: 'xxxx',
    keywords: 'xxxx'
  };

  render() {
    const { title, description = '', keywords = '', externalCss, externalJs, styles, scripts, appData, children } = this.props;
    return (
      <html className="no-js" lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name='referrer' content='never'/>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=no"
          />
          <meta name="keywords" content={keywords}/>
         <link rel="icon"  type="image/png"  href="/assets/favicon.png"/>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            (function() {
            var dpr, rem, scale;
            var docEl = document.documentElement;
            var fontEl = document.createElement('style');
            var metaEl = document.querySelector('meta[name="viewport"]');

            dpr = window.devicePixelRatio || 1;
            rem = docEl.clientWidth * dpr / 10;
            scale = 1 / dpr;
            var ua = window && window.navigator && window.navigator.userAgent;
            if (!ua || (ua && !/(iphone|ipad|ipod|android)/i.exec(ua))) {
              dpr = 1;
              scale = 1;
              rem = 14;
            }
            rem = 14;
            dpr = 1;
            scale = 1;

            // 设置viewport,进行缩放，达到高清效果
            // metaEl.setAttribute('content', 'width=' + dpr * docEl.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no');
            metaEl.setAttribute('content', 'width=device-width, initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no');

            // 设置data-dpr属性,留作css hack之用
            docEl.setAttribute('data-dpr', dpr);

            // 动态写入样式
            docEl.firstElementChild.appendChild(fontEl);
            fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';

            // 给js调用，某一dpr下rem和px之间的转换函数
            window.rem2px = function(v) {
              return parsetFloat(v) * rem;
            };
            window.px2rem = function(v) {
              return parseFloat(v) / rem;
            }
            window.dpr = dpr;
            window.rem = rem;
            })();
          `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
          !function(e,t,n,g,i){e[i]=e[i]||function(){(e[i].q=e[i].q||[]).push(arguments)},n=t.createElement("script"),tag=t.getElementsByTagName("script")[0],n.async=1,n.src=('https:'==document.location.protocol?'https://':'http://')+g,tag.parentNode.insertBefore(n,tag)}(window,document,"script","assets.growingio.com/2.1/gio.js","gio");
            gio('init', 'b85ad73208c2db1b', {});

            gio('send');
          `}}/>
          {scripts.map(script => (
            <link key={script} rel="preload" href={script} as="script" />
          ))}
          <link rel="stylesheet" type="text/css" href="/assets/pure-min.css"/>
          <link rel="stylesheet" type="text/css" href="/assets/grids-responsive-min.css"/>
          {externalCss.map((style, index) => <link key={index} rel="stylesheet" type="text/css" href={style}/>)}
          {styles.map((style, index) => <link key={index} rel="stylesheet" type="text/css" href={style}/>)}
          <link rel="apple-touch-icon" href="/assets/favicon.png" />
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.__PRELOADED_STATE__=${serialize(appData)}` }}
          />
          {externalJs.map((script, index) => <script key={index} src={script}/>)}
          {scripts.map(script => <script key={script} src={script} />)}
        </body>
      </html>
    );
  }
}

export default Html;
