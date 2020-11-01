class TokenDef {
	constructor(type, regexp) {
		this.type = type
		this.regexp = regexp
	}
}

const possibleTokens = [
	new TokenDef("plus", /^\+/),
	new TokenDef("minus", /^\-/),
	new TokenDef("matrix_mult", /^\*\*/),
	new TokenDef("mult", /^\*/),
	new TokenDef("div", /^\//),
	new TokenDef("mod", /^%/),
	new TokenDef("pow", /^\^/),
	new TokenDef("equal", /^=/),
	new TokenDef("number", /^\d+\.?\d*/),
	new TokenDef("i", /^i/),
	new TokenDef("var", /^[a-zA-Z]/),
	new TokenDef("open_par", /^\(/),
	new TokenDef("close_par", /^\)/),
	new TokenDef("open_brack", /^\[/),
	new TokenDef("close_brack", /^\]/),
	new TokenDef("comma", /^,/),
	new TokenDef("semicolon", /^;/),
	new TokenDef("quest_mark", /^\?/),
]

function tokenize(line) {
	let tokens = [];

	while (line.length > 0) {
		//Removing spaces at the start of the string
		let spaces = /^\s+/.exec(line)
		if (spaces != null)
			line = line.substring(spaces[0].length)
		if (line.length != 0) {
			possibleTokens.find(tokDef => {
				let regRes = tokDef.regexp.exec(line)
				if (regRes == null)
					return false
				let token = { type: tokDef.type }
				if (tokDef.type == "number")
					token.value = +regRes[0]
				else if (tokDef.type == "var")
					token.value = regRes[0].toLowerCase()
				tokens.push(token)
				line = line.substring(regRes[0].length)
				return true
			})
		}
	}
	return tokens;
}

module.exports = tokenize;
