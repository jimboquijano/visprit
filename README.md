# Visprit

Visprit is an animation library that provides **glance** and **scroll** animations for DOM elements. It’s designed to be performant and highly configurable via JSON attributes.

## Installation

### Via npm

```bash
npm install visprit

```

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/visprit@latest/dist/visprit.umd.min.js"></script>
```

## Usage

### HTML Setup

Add the `vs-glance` or `vs-scroll` attribute to elements:

```html
<!-- Glance Animation -->
<div vs-glance="fade:true|duration:500">Glance Element</div>

<!-- Scroll Animation -->
<div vs-scroll="resist:0.3">Scroll Element</div>
```

### JavaScript Initialization

```js
import { startVsGlance, startVsScroll } from 'visprit'

document.addEventListener('DOMContentLoaded', () => {
  startVsGlance() // triggers all vs-glance elements
  startVsScroll() // triggers all vs-scroll elements
})
```

> For CDN users, the triggers are run automatically on page load, no need to call them.

## Global Options Table

| Option Name     | Type              | Default / Example                                                              | Description                                            |
| --------------- | ----------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `duration`      | number (ms)       | 700 / 1000                                                                     | Animation duration in milliseconds                     |
| `delay`         | number (ms)       | 0                                                                              | Delay before the animation starts                      |
| `easing`        | string            | any easings                                                                    | Timing function for the animation                      |
| `hasElastic`    | boolean           | false                                                                          | Whether to use elastic motion                          |
| `elastic`       | string            | `spring`, `bounce`                                                             | Elastic motion type if `hasElastic` is true            |
| `stiffness`     | number            | 3                                                                              | Spring stiffness for elastic effects                   |
| `damping`       | number            | 1                                                                              | Damping for elastic motion                             |
| `mass`          | number            | 10                                                                             | Mass for elastic motion                                |
| `hasCascade`    | boolean           | false                                                                          | Whether to cascade the animation across child elements |
| `cascadeEl`     | string / selector | `*`                                                                            | Elements affected by cascade                           |
| `cascadeInt`    | number (ms)       | 200                                                                            | Interval between cascaded animations                   |
| `cascadeAlt`    | boolean           | false                                                                          | Whether to alternate cascade direction                 |
| `cascadeOsc`    | boolean           | false                                                                          | Whether cascade oscillates back and forth              |
| `peek`          | number            | 20                                                                             | Distance for peek / initial offset effect              |
| `fade`          | number            | 50 / 100                                                                       | Opacity percentage for fade effect                     |
| `hasMask`       | boolean           | false                                                                          | Whether a mask effect is applied                       |
| `clipPathType`  | string            | `left`, `right`, `top`, `bottom`, `hout`, `vout`, `vhout`                      | Type of clipping for curtain / wipe effect             |
| `clipPath`      | number            | 100                                                                            | Amount of clipping in percentage                       |
| `scaleType`     | string            | `in`, `out`, `hin`, `hout`, `vin`, `vout`                                      | Type of scaling effect                                 |
| `scale`         | number            | 50                                                                             | Amount of scaling in percentage                        |
| `rotateType`    | string            | `left`, `right`, `top`, `bottom`, `clockwise`, `counter`                       | Rotation direction                                     |
| `rotate`        | number            | 45 / 30 / 135                                                                  | Rotation angle in degrees                              |
| `skewType`      | string            | `vleft`, `vright`, `htop`, `hbottom`                                           | Type of skew effect                                    |
| `skew`          | number            | 30 / 50                                                                        | Skew angle                                             |
| `translateType` | string            | `left`, `right`, `top`, `bottom`, `topleft`, `topright`, `botleft`, `botright` | Direction of movement                                  |
| `translate`     | number            | 100 / 400                                                                      | Movement distance in pixels                            |
| `hasPers`       | boolean           | false                                                                          | Whether to use perspective for rotation                |
| `start`         | number            | 0                                                                              | Starting value for counter effect                      |
| `end`           | number            | 100                                                                            | Ending value for counter effect                        |
| `format`        | string            | `{counter}`                                                                    | Counter display format                                 |
| `opacityType`   | boolean           | true                                                                           | Whether opacity is affected (scroll fade)              |
| `resistUp`      | number            | 5                                                                              | Resistance to upward scroll                            |
| `resistDown`    | number            | 5                                                                              | Resistance to downward scroll                          |
| `hasStop`       | boolean           | false                                                                          | Whether scroll effect stops at a certain width         |
| `stopWidth`     | number / null     | null                                                                           | Width at which scroll effect stops                     |
| `hasActivate`   | boolean           | false                                                                          | Whether scroll effect activates at origin              |
| `origin`        | string            | `top`, `bottom`, `cener`, `custom`                                             | Origin point for scroll effect                         |
| `originSize`    | number            | 0                                                                              | Size of the origin area for scroll effect              |
| `bearing`       | string            | `resume`, `damper-down`, `damper-up`, `return-up`, `return-down`               | Scroll motion behavior                                 |

## Glance Premade Effects

| Effect Name | Key Options                                                                                                                                                                                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **fade**    | `duration:1000\|delay:0\|easing:ease\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeOsc:false\|peek:20\|fade:100`                                                                                                                                                  |
| **flip**    | `rotateType:left\|rotate:45\|duration:700\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                                                     |
| **mask**    | `translateType:right\|translate:100\|duration:1000\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasMask:true\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                              |
| **move**    | `translateType:right\|translate:100\|duration:1000\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                                            |
| **clip**    | `clipPathType:right\|clipPath:100\|duration:700\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:0`                                                |
| **scale**   | `scaleType:in\|scale:50\|duration:700\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                                                         |
| **curtain** | `clipPathType:hout\|clipPath:100\|duration:1000\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:0`                                                |
| **distort** | `skewType:htop\|skew:30\|duration:700\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                                                         |
| **fly**     | `translateType:botright\|translate:100\|duration:1000\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                                         |
| **sneak**   | `translateType:botright\|translate:100\|duration:1000\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasMask:true\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                           |
| **spin**    | `rotateType:clockwise\|rotate:45\|duration:500\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                                                |
| **stretch** | `scaleType:hin\|scale:50\|duration:700\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                                                        |
| **bloom**   | `rotateType:clockwise\|scaleType:out\|rotate:30\|scale:50\|duration:700\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                       |
| **counter** | `start:0\|end:100\|format:{counter}\|duration:1000\|delay:0\|easing:ease\|hasCounter:true\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                                                                                              |
| **snap**    | `translateType:right\|scaleType:in\|translate:400\|scale:50\|duration:700\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                     |
| **toss**    | `translateType:right\|rotateType:right\|translate:400\|rotate:135\|duration:700\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasPers:true\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50` |
| **tumble**  | `translateType:right\|rotateType:clockwise\|translate:400\|rotate:30\|duration:700\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`            |
| **warp**    | `translateType:right\|skewType:htop\|translate:400\|skew:50\|duration:700\|delay:0\|easing:ease\|hasElastic:false\|elastic:spring\|stiffness:3\|damping:1\|mass:10\|hasCascade:false\|cascadeEl:*\|cascadeInt:200\|cascadeAlt:false\|peek:20\|fade:50`                     |
|             |

## Scroll Premade Effects

| Effect Name | Key Options                                                                                                                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **distort** | `skewType:htop\|resistUp:5\|resistDown:5\|duration:1000\|easing:linear\|hasStop:false\|stopWidth:null\|hasActivate:false\|origin:center\|originSize:0\|bearing:resume`                         |
| **flip**    | `rotateType:left\|resistUp:5\|resistDown:5\|duration:1000\|easing:linear\|hasStop:false\|stopWidth:null\|hasActivate:false\|origin:center\|originSize:0\|bearing:resume`                       |
| **move**    | `translateType:right\|resistUp:5\|resistDown:5\|duration:1000\|easing:linear\|hasStop:false\|stopWidth:null\|hasActivate:false\|origin:center\|originSize:0\|bearing:resume`                   |
| **spin**    | `rotateType:clockwise\|resistUp:5\|resistDown:5\|duration:1000\|easing:linear\|hasStop:false\|stopWidth:null\|hasActivate:false\|origin:center\|originSize:0\|bearing:resume`                  |
| **stretch** | `scaleType:hin\|resistUp:5\|resistDown:5\|duration:1000\|easing:linear\|hasStop:false\|stopWidth:null\|hasActivate:false\|origin:center\|originSize:0\|bearing:resume`                         |
| **zoom**    | `scaleType:in\|resistUp:5\|resistDown:5\|duration:1000\|easing:linear\|hasStop:false\|stopWidth:null\|hasActivate:false\|origin:center\|originSize:0\|bearing:resume`                          |
| **curtain** | `clipPathType:hout\|clipPath:100\|resistUp:5\|resistDown:5\|duration:1000\|easing:linear\|hasStop:false\|stopWidth:null\|hasActivate:false\|origin:center\|originSize:0\|bearing:damper-down`  |
| **fade**    | `opacityType:true\|resistUp:5\|resistDown:5\|duration:1000\|easing:linear\|hasStop:false\|stopWidth:null\|hasActivate:false\|origin:center\|originSize:0\|bearing:damper-down`                 |
| **wipe**    | `clipPathType:right\|clipPath:100\|resistUp:5\|resistDown:5\|duration:1000\|easing:linear\|hasStop:false\|stopWidth:null\|hasActivate:false\|origin:center\|originSize:0\|bearing:damper-down` |
