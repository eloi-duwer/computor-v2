const { tokenTypes, FunctionType, NumberType, PolynomialType, VariableType } = require(__dirname + '/../tokens.js')
const { addComplex, multComplex, divComplex } = require(__dirname + '/numberOperations.js')
const variableEvaluation = require(__dirname + '/variableEvaluation.js')

function errorFuncAssign(msg, tokens) {
	console.error("Function declaration syntax is invalid: " + msg)
	console.error("Tokens: " + tokens.map(t => t.toString()).join(' '))
	return null
}

const authorizedPolynomialTypes = [
	tokenTypes.plus,
	tokenTypes.minus,
	tokenTypes.mult,
	tokenTypes.div,
	tokenTypes.power,
	tokenTypes.complexNumber,
	tokenTypes.variable,
]

//Tokens contains only tokens that can be on a polynomial number
//Doesn't guarantees that it has the good syntax though
function isPolynomialLike(tokens) {
	return tokens.every(t => authorizedPolynomialTypes.includes(t.type))
}

function addMonome(monomes, exp, coeff, sign) {
	//If the coefficient is 0, we do nothing, as the result will be 0
	if (coeff.real !== 0 || coeff.complex !== 0) {
		//exponent is not a real number (eg positive integer), this expression can't be a polynomial
		if (!Number.isInteger(exp.real) || exp.complex !== 0)
			return null
		//We create a new monome in the list	
		if (!monomes.hasOwnProperty([exp.real])) {
			monomes[exp.real] = multComplex(coeff, sign)
		}
		else { //We add the old coefficient with the new one
			monomes[exp.real] = addComplex(monomes[exp.real], multComplex(coeff, sign))
		}
	}
	return monomes
}

function createPolynomial(funcName, vars, tokens) {
	let monomes = {}
	let i = 0
	let exp = new NumberType(0, 0)
	let coeff = new NumberType(0, 0)
	let sign = new NumberType(1, 0)
	while (i < tokens.length) {
		//It's a new monome: we add the current one to the list, and we initialize a new one
		if (tokens[i].type === tokenTypes.minus || tokens[i].type === tokenTypes.plus) {
			monomes = addMonome(monomes, exp, coeff, sign)
			if (monomes === null)
				return null
			//Initialize for the next monome
			exp = new NumberType(0, 0)
			coeff = new NumberType(0, 0)
			if (tokens[i].type === tokenTypes.minus)
				sign = new NumberType(-1, 0)
			else
				sign = new NumberType(1, 0)
		}
		else if (tokens[i].type === tokenTypes.complexNumber)
			coeff = tokens[i]
		else if (tokens[i].type === tokenTypes.mult) {
			//We expected a number/variable after the *, parsing error
			if (i + 1 >= tokens.length || (tokens[i + 1].type !== tokenTypes.variable && tokens[i + 1].type !== tokenTypes.complexNumber))
				return null
			//If it is a variable the coefficient does not change, the case will be handled in the next loop
			if (tokens[i + 1].type !== tokenTypes.variable) {
				coeff = multComplex(coeff, tokens[i + 1])
				i++
			}
		}
		else if (tokens[i].type === tokenTypes.div) {
			//We expected a number after the /, parsing error (we can't divide by the variable in a polynomial)
			if (i + 1 >= tokens.length || tokens[i + 1].type !== tokenTypes.complexNumber)
				return null
			coeff = divComplex(coeff, tokens[i + 1])
			i++
		}
		else if (tokens[i].type === tokenTypes.variable) {
			if (i + 1 >= tokens.length || tokens[i + 1].type !== tokenTypes.power) {
				exp = addComplex(exp, new NumberType(1, 0))
				if (coeff.real === 0)
					coeff = new NumberType(1, 0)
			}
			else if (i + 2 < tokens.length && tokens[i + 2].type === tokenTypes.complexNumber) {
				exp = addComplex(exp, tokens[i + 2])
				i += 2
				if (coeff.real === 0)
					coeff = new NumberType(1, 0)
			}
			else // Parsing error: we got a ^ but no number after it, this can't be a polynomial
				return null
		}
		else
			return null
		i++
	}
	//We add the last one
	monomes = addMonome(monomes, exp, coeff, sign)
	if (monomes === null)
		return null
	if (Object.keys(monomes) === 0)
		return null
	return new PolynomialType(funcName, vars[0].name, monomes)
}

const functionAssignation = {
	pattern: tokens => {
		if (tokens.length <= 5 //Minimum length of tokens for a function definition is 6: f ( x ) = ...
			|| tokens[0].type !== tokenTypes.variable
			|| tokens[1].type !== tokenTypes.openParenthesis)
			return [-1, -1]
		let indexFinPar = tokens.findIndex(t => t.type === tokenTypes.closeParenthesis) //Finding the index of the mathing closing parenthesis
		if (indexFinPar === -1 || indexFinPar >= tokens.length - 2) // There must be at least 2 tokens after the closing parenthesis
			return [-1, -1];
		if (tokens[indexFinPar + 1].type !== tokenTypes.equal) // There must be an equal sign after the closing parenthesis
			return [-1, -1]
		if (indexFinPar > 2 && indexFinPar % 2 === 0) // There can only be an odd number of tokens before the closing parenthesis, as new arguments add two tokens (arg + comma), exception when the funciton has no arguments
			return [-1, -1]
		if (!tokens.slice(2, indexFinPar).every((t, i) => { //Checking for tokens between the parenthesis: we must only have variables and commas, alternating
			if (i % 2 === 0 && t.type !== tokenTypes.variable)
				return false
			else if (i % 2 === 1 && t.type !== tokenTypes.comma)
				return false
			return true
		}))
			return [-1, -1]
		if (tokens[tokens.length - 1].type === tokenTypes.questionMark) //Special case for polynomial resolution, and anyway it doesnt make sense in a function declaration
			return [-1, -1]
		return [0, tokens.length]
	},
	evaluate: ([_pos, _len], tokens, variables) => {
		let name = tokens[0].name
		let vars = []
		let i = 2
		while (i < tokens.length && tokens[i].type !== tokenTypes.closeParenthesis) {
			if (tokens[i].type !== tokenTypes.variable)
				return errorFuncAssign(`Expected a variable at token n°${i + 1}`, tokens)
			vars.push(tokens[i])
			i++
			if (tokens[i].type === tokenTypes.closeParenthesis)
				continue
			if (tokens[i].type !== tokenTypes.comma)
				return errorFuncAssign(`Expected a comma at token n°${i + 1}`, tokens)
			i++
		}
		i++
		if (i >= tokens.length || tokens[i].type !== tokenTypes.equal)
			return errorFuncAssign(`Expected an equal at token n°${i + 1}`, tokens)
		let funcTokens = tokens.slice(i + 1)
		if (funcTokens.length === 0)
			return errorFuncAssign("Expected tokens after the equal", tokens)
		if (funcTokens.length === 0)
			return errorFuncAssign("Function definition tokens evaluated to nothing, there is likely an error above that caused this error", funcTokens)
		while (true) {
			let [pos, len] = variableEvaluation.pattern(funcTokens, vars)
			if (pos === -1 || len === -1)
				break;
			let ret = variableEvaluation.evaluate([pos, len], funcTokens, variables)
			if (ret === null)
				return null
			funcTokens.splice(pos, len, ret)
		}
		let func
		if (vars.length === 1 && isPolynomialLike(funcTokens)) {
			func = createPolynomial(name, vars, funcTokens)
			if (func === null) { // The function can't be assimiled as a polynomial, we return a classic function
			func = new FunctionType(name, vars, funcTokens)
			}
		}
		else {
			func = new FunctionType(name, vars, funcTokens)
		}
		let variableFunc = new VariableType(func.toString())
		variableFunc.value = func
		variableFunc.name = func.name
		variables[name] = variableFunc
		return func
	}
}

module.exports = functionAssignation
