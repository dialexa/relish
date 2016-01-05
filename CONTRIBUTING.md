# How to contribute
_We happily welcome contributions from the community! Please follow this guide when logging issues or making code changes._

## Help Wanted
If you are interested in contributing but don't know where to start, check out the ["help wanted" issues][help-wanted] for ideas.

## Logging Issues / Feature Requests
All issues or feature requests should be created using [GitHub Issues][new-issue]. Clearly describe the issue including steps to reproduce if there are any. Also, make sure to indicate the earliest version that has the issue being reported.

Lastly, please indicate if your issue is a **feature request** or **bug**.

## Making Changes
Code or documentation changes are welcome and should follow the guidelines below.

* [Fork this repository][working-with-forks] and create a new branch for your changes
* Make your changes and don't be afraid to ask questions!
* If making code changes, don't forget to **add tests** and **lint** your new code following the [JS Standard][js-standard-rules] code style
  * Run `npm run lint` to lint your code
  * Run `npm test` to execute tests and report code coverage
  * _Yes, we require 100% code coverage for all Pull Requests_
* Once finished, [submit a Pull Request][new-pull-request] for your changes
  * All Pull Requests should be made to the `master` branch
  * Make sure your branch is up to date with the upstream repository (if not, perform a downstream merge and resolve any merge conflicts)

<!-- URLs -->
[new-issue]:https://github.com/dialexa/relish/issues/new
[new-pull-request]:https://github.com/dialexa/relish/pull/new/master
[help-wanted]:https://github.com/dialexa/relish/labels/help%20wanted
[working-with-forks]:http://help.github.com/articles/working-with-forks/
[js-standard-rules]:http://standardjs.com/rules.html
