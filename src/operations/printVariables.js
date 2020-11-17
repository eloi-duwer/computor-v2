const { printToken } = require("../utils")

const { tokenTypes } = require(__dirname + '/../tokens.js')

const printVars = {
	pattern: tokens => {
		if (tokens.length === 1 && tokens[0].type === tokenTypes.printVars)
			return [0, 1]
		return [-1, -1]
	},
	evaluate: ([_pos, _len], _tokens, variables) => {
		Object.keys(variables).forEach(k => {
			let val = variables[k].value
			if (val === undefined || val === null)
				console.log(`${k}: null`)
			else
				console.log(`${k}: ${val.toString()}`)
		})
		return null
	}
}

const printFullVars = {
	pattern: tokens => {
		if (tokens.length === 1 && tokens[0].type === tokenTypes.printFullVars)
			return [0, 1]
		return [-1, -1]
	},
	evaluate: ([_pos, _len], _tokens, variables) => {
		Object.keys(variables).forEach(k => {
			console.log(`${k}:`, variables[k])
		})
		return null
	}
}

module.exports = {
	printVars,
	printFullVars
}
