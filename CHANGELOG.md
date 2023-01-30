# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [frontend-0.4.2] - 2023-01-30

**@semapps/semantic-data-provider**
- Pod login & proxy authentication [#1091](https://github.com/assemblee-virtuelle/semapps/pull/1091) (*:warning: Breaking changes*)
- Convert sparqlwhere parameter to object if it is a string [#1104](https://github.com/assemblee-virtuelle/semapps/pull/1104)

**@semapps/auth-provider**
- Don't throw error if permissions cannot be fetched [54500de0](https://github.com/assemblee-virtuelle/semapps/commit/54500de024b4e0e9ef0ec357282086a6bebefb65)

**@semapps/interop-components**
- Control lexiconImportForm to avoid creating empty items [#1090](https://github.com/assemblee-virtuelle/semapps/pull/1090)
- fetchESCO: allow to choose a type of classification ](https://github.com/assemblee-virtuelle/semapps/commit/29784572924524579540eacf87741e3be952d370)

## [middleware-0.4.1] - 2023-01-13

- Use named routes for moleculer-web [#1099](https://github.com/assemblee-virtuelle/semapps/pull/1099)

**@semapps/core**
- Fix bug created datasets are always secure [d181bfbc](https://github.com/assemblee-virtuelle/semapps/commit/d181bfbc0a6a94c666cc96f4cc1a78e15f111372)

**@semapps/activitypub**
- Fix activitypub.actor.getProfile action [41fa295f](https://github.com/assemblee-virtuelle/semapps/commit/41fa295f9613f9e54b681aacf5f10aabc8a8b6a2)

**@semapps/auth**
- Fix auth.local.login action: return newUser false [6603dc86](https://github.com/assemblee-virtuelle/semapps/commit/6603dc865d70e62c57800d120a8c0de1f2e16a84)

**@semapps/ldp**
- ldp.resource.upload: fix files type [caddbf43](https://github.com/assemblee-virtuelle/semapps/commit/caddbf43a4a93b5d88a9465dc0fd548467d3acfb)

**@semapps/inference**
- InferenceService: handle cases where triples are undefined [fab3aaef](https://github.com/assemblee-virtuelle/semapps/commit/fab3aaef81089f9b132e53f5c2b33485c502154e)

## [frontend-0.4.1] - 2022-12-08

**@semapps/activitypub-components**
- CommentsField: prevent page to scroll to input on load [1183b6f3](https://github.com/assemblee-virtuelle/semapps/commit/1183b6f31ccf5ce4fe68794acadab266395c22af)
- CommentsField: add placeholder prop [abebb823](https://github.com/assemblee-virtuelle/semapps/commit/abebb82396afbfa0a655f8ba42327432370bf731)

**@semapps/interop-components**
- LexiconAutocompleteInput: fix no suggestion to add to dictionary on modal show [a3902b68](https://github.com/assemblee-virtuelle/semapps/commit/a3902b68bf19bd910199a321ec535ad81856fd9e)

## [0.4.0] - 2022-11-23

For all changes prior to v0.4.0, see the [Github releases](https://github.com/assemblee-virtuelle/semapps/releases)
