const { tokenTypes, createDataToken } = require(__dirname + '/tokens.js')

class TokenDef {
	constructor(type, regexp) {
		this.type = type
		this.regexp = regexp
	}
}

/**
 * List of all supported tokens.
 * This is all the possible "words" of the computor
 * They will be evaluated in more complex structures (eg variable assignation, complex number...) in the evaluator
 * Remember to put more specific cases before less specific cases!
 * eg: i before var
 */
const possibleTokens = [
	new TokenDef(tokenTypes.plus, /^\+/),
	new TokenDef(tokenTypes.minus, /^\-/),
	new TokenDef(tokenTypes.matrixMultiplication, /^\*\*/),
	new TokenDef(tokenTypes.mult, /^\*/),
	new TokenDef(tokenTypes.div, /^\//),
	new TokenDef(tokenTypes.mod, /^%/),
	new TokenDef(tokenTypes.power, /^\^/),
	new TokenDef(tokenTypes.equal, /^=/),
	new TokenDef(tokenTypes.realNumber, /^\d+\.?\d*/),
	new TokenDef(tokenTypes.i, /^i/),
	new TokenDef(tokenTypes.printVars, /^vars/),
	new TokenDef(tokenTypes.printFullVars, /^fullVars/),
	new TokenDef(tokenTypes.variable, /^[a-zA-Z]/),
	new TokenDef(tokenTypes.openParenthesis, /^\(/),
	new TokenDef(tokenTypes.closeParenthesis, /^\)/),
	new TokenDef(tokenTypes.openBracket, /^\[/),
	new TokenDef(tokenTypes.closeBracket, /^\]/),
	new TokenDef(tokenTypes.comma, /^,/),
	new TokenDef(tokenTypes.semicolon, /^;/),
	new TokenDef(tokenTypes.questionMark, /^\?/),
]

function tokenize(line) {
	let tokens = [];

	while (line.length > 0) {
		//Removing spaces at the start of the string
		let spaces = /^\s+/.exec(line)
		if (spaces !== null)
			line = line.substring(spaces[0].length)
		if (line.length != 0) {
			const res = possibleTokens.find(tokDef => {
				const regRes = tokDef.regexp.exec(line)
				if (regRes === null)
					return false
				tokens.push(createDataToken(tokDef.type, regRes[0]))
				line = line.substring(regRes[0].length)
				return true
			})
			if (res == null) {
				console.error(`Unrecognized token: ${line[0]} (ignored)`)
				line = line.substring(1)
			}
		}
	}
	return tokens;
}

module.exports = tokenize;
