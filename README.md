# Oaxis

AXISNet command line version.

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [License](#license)

## Installation

```
npm install -g oaxis
```

## Usage

```
oaxis command [args...] [...] -a YOUR_AUTH_CODE
```

### List Package

```
oaxis list [--active, -f | --filter <keyword>] [...]
```

> keywords available: all, boostr, internet, & nbo

#### List active package shorthand

```
oaxis active
```

### Buy package

```
oaxis buy <package id> [-t | --type <package type>] [...]
```

### Claim free package

```
oaxis claim <package name | package id>
```

> supported packages: viu, aov, smule, kwai, nimo, freefire, tiktok, hago, tinder, joox, netflix, etc

## Examples

- Buy Boostr Video Rp. 1500

```
oaxis buy 3213033
```

- List active packages

```
oaxis list --active
```

## License

[MIT License](LICENSE.md)
