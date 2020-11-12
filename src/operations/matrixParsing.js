const { tokenTypes, MatrixType } = require(__dirname + '/../tokens.js')

function printErrorMatrix(tokens, msg) {
	console.error("Matrix declaration syntax is invalid: " + msg);
	console.error("Tokens: " + tokens.map(t => t.toString()).join(' '))
}

function parseMatrixLine(ret, matrixTokens, i) {
	let retIndex = ret.length - 1
	if (matrixTokens[i].type !== tokenTypes.openBracket) {
		printErrorMatrix(matrixTokens, `Expected a [ but got ${matrixTokens[i].type} on token n°${i + 1}`)
		return -1
	}
	i++;
	while (i < matrixTokens.length) {
		if (matrixTokens[i].type !== tokenTypes.complexNumber) {
			printErrorMatrix(matrixTokens, `Expected a number but got ${matrixTokens[i].type} on token n°${i + 1}`)
			return -1
		}
		ret[retIndex].push(matrixTokens[i])
		i++
		if (matrixTokens[i].type === tokenTypes.closeBracket) {
			i++
			break
		}
		else if (matrixTokens[i].type !== tokenTypes.comma) {
			printErrorMatrix(matrixTokens, `Expected a , but got ${matrixTokens[i].type} on token n°${i + 1}`)
			return -1
		}
		i++;
	}
	if (i < matrixTokens.length) {
		if (matrixTokens[i].type !== tokenTypes.semicolon) {
			printErrorMatrix(matrixTokens, `Expected a ; or ], but got ${matrixTokens[i].type} on token n°${i + 1}` )
			return -1
		}
		i++
	}
	if (ret[retIndex].length !== ret[0].length) {
		console.error(`Line n°${retIndex + 1} does not have the same length as the other lines`);
		return -1
	}
	return i
}

const matrixParser = {
	pattern: token => {
		let i = 0;
		let posFirstBracket = -1
		let nbBrackets = 0
		while (i < token.length) {
			if (tokens[i].type === tokenTypes.openBracket) {
				if (posFirstBracket === -1)
					posFirstBracket = i
				nbBrackets++
			}
			else if (posFirstBracket !== -1 && tokens[i].type === tokenTypes.closeBracket)
				nbBrackets--
			if (posFirstBracket !== -1 && nbBrackets === 0)
				return [posFirstBracket, i - posFirstBracket + 1]
			i++
		}
		return [-1, -1]
	},
	evaluate: ([pos, len], tokens, _variables) => {
		if (len === 2) {
			console.error("A matrix can't be empty")
			return null
		}
		let matrixTokens = tokens.slice(pos + 1, pos + len - 1)
		let i = 0;
		let res = []
		while (i < matrixTokens.length) {
			res.push([])
			let retLine = parseMatrixLine(res, matrixTokens, i)
			if (retLine === -1)
				return null
			i = retLine
		}
		return new MatrixType(res)
	}
}

module.exports = matrixParser
