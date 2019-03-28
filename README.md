# Task Explorer - Control Tasks from Explorer View

[![Version](https://vsmarketplacebadge.apphb.com/version-short/spmeesseman.vscode-taskexplorer.svg)](https://marketplace.visualstudio.com/items?itemName=spmeesseman.vscode-taskexplorer)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/spmeesseman.vscode-taskexplorer.svg)](https://marketplace.visualstudio.com/items?itemName=spmeesseman.vscode-taskexplorer)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/spmeesseman.vscode-taskexplorer.svg)](https://marketplace.visualstudio.com/items?itemName=spmeesseman.vscode-taskexplorer)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Build Status](https://dev.azure.com/spmeesseman/vscode-taskexplorer/_apis/build/status/spmeesseman.vscode-taskexplorer?branchName=master)](https://dev.azure.com/spmeesseman/vscode-taskexplorer/_build/latest?definitionId=6&branchName=master)

[![Known Vulnerabilities](https://snyk.io/test/github/spmeesseman/vscode-taskexplorer/badge.svg)](https://snyk.io/test/github/spmeesseman/vscode-taskexplorer)
[![codecov](https://codecov.io/gh/spmeesseman/vscode-taskexplorer/branch/master/graph/badge.svg)](https://codecov.io/gh/spmeesseman/vscode-taskexplorer)
[![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/spmeesseman/vscode-taskexplorer.svg)](https://isitmaintained.com/project/spmeesseman/vscode-taskexplorer "Average time to resolve an issue")
[![Percentage of issues still open](https://isitmaintained.com/badge/open/spmeesseman/vscode-taskexplorer.svg)](https://isitmaintained.com/project/spmeesseman/vscode-taskexplorer "Percentage of issues still open")
[![Dependencies Status](https://david-dm.org/spmeesseman/vscode-taskexplorer/status.svg)](https://david-dm.org/spmeesseman/vscode-taskexplorer)
[![DevDependencies Status](https://david-dm.org/spmeesseman/vscode-taskexplorer/dev-status.svg)](https://david-dm.org/spmeesseman/vscode-taskexplorer?type=dev)

## Description

> Provides a single view in the Explorer that conveniently displays all VSCode tasks, NPM scripts, Gulp tasks, Grunt tasks, and Ant targets, grouped within their respective task nodes.  Tasks can be either opened or executed.  See Requirements section below.

## Requirements

* Visual Studio Code v1.30 or higher
* For npm, grunt, and gulp tasks, the 'Auto Detect' vscode setting must be turned 'On' for each respective task provider.

## Features

* Open and launch Visual Studio Code tasks
* Open and launch NPM scripts as tasks
* Open and launch Ant targets as tasks

## Coming Soon

* Open and launch Gulp tasks
* Open and launch Grunt tasks
* Open and launch C/C++ Makefiles
* Progress icons for running tasks
* Stop execution button for running tasks

## Screenshots

![extension ss1](https://github.com/spmeesseman/vscode-taskexplorer/blob/master/res/taskview.png?raw=true)
![extension ss2](https://github.com/spmeesseman/vscode-taskexplorer/blob/master/res/taskview2.png?raw=true)

## Feedback & Contributing

* Please report any bugs, suggestions or documentation requests via the
  [Issues](https://github.com/spmeesseman/vscode-taskexplorer/issues)
* Feel free to submit
  [pull requests](https://github.com/spmeesseman/vscode-taskexplorer/pulls)
* [Contributors](https://github.com/spmeesseman/vscode-taskexplorer/graphs/contributors)

## Settings

|Config|Description|Default|
|-|-|-|
|`taskView.enableCodeTasks`|Enable/show visual studio code tasks|`true`|
|`taskView.enableGulpTasks`|Enable/show ant targets as tasks|`true`|
|`taskView.enableGruntTasks`|Enable/show ant targets as tasks|`true`|
|`taskView.enableNpmScripts`|Enable/show npm scripts as tasks|`true`|
|`taskView.enableAntTargets`|Enable/show ant targets as tasks|`true`|
|`taskView.enableAnsiconForAnt`|Enable ansicon output colorization for ant tasks|`false`|",
|`taskView.pathToAnt`|The path to the ant program, if not registered in system path||",
|`taskView.pathToAnsicon`|The path to the ansicon binary, if not registered in system path||",
|`taskView.debug`|Turn on logging|`false`|
|`taskView.runSilent`|Run commands with the `--silent` option|`false`|
|`taskView.exclude`|Configure glob patterns for folders that should be excluded from automatic script detection|`["**/ext/**", "**/packages/**", "**/.vscode-test/**""**/build**"]`|
|`taskView.fetchOnlinePackageInfo`|Fetch data from https://registry.npmjs.org and https://registry.bower.io to provide auto-completion and information on hover features on npm dependencies|`true`|
