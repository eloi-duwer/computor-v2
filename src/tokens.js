const tokenTypes = {
	// "Primitive" types, that are parsed directly from user input
	plus: "plus",
	minus: "minus",
	matrixMultiplication: "matrixMultication",
	mult: "mult",
	div: "div",
	mod: "mod",
	power: "power",
	equal: "equal",
	realNumber: "realNumber",
	i: "i",
	variable: "variable",
	openParenthesis: "openParenthesis",
	closeParenthesis: "closeParenthesis",
	openBracket: "openBracket",
	closeBracket: "closeBracket",
	comma: "comma",
	semicolon: "semicolon",
	questionMark: "questionMark",
	printVars: "printVars",
	printFullVars: "printFullVars",
	// "Complex" types, they are a construction of multiple primitive types
	//Actually complex numbers are used to represent all numbers in the app, as they are a generalization of real numbers
	complexNumber: "complexNumber",
	equation: "equation",
	matrix: "matrix",
}

class DataType {
	constructor(tokenType, sourceStr) {
		this.type = tokenType
		this.sourceStr = sourceStr
		this.toString = () => sourceStr
	}
}

//General number type, used for Real and Complex numbers
//Formulas for Real are derived for Complex cases, so it is generally simpler to merge the two
class NumberType extends DataType {
	constructor(real, complex) {
		
		let sourceStr = ''
		// It is a real number
		if (complex === 0)
		sourceStr = real.toString()
		// Complex number: we add the real part if !== 0 (eg to not return 0 + 2i)
		else {
			if (real !== 0) {
				sourceStr += real.toString() + ' '
				if (complex >= 0)
					sourceStr += '+ '
			}
			if (complex < 0)
				sourceStr += '- '
			sourceStr += (complex !== -1 && complex !== 1 ? Math.abs(complex).toString() : '') + 'i'
		}
		super(tokenTypes.complexNumber, sourceStr)
		this.real = real;
		this.complex = complex;
	}
}

class VariableType extends DataType {
	constructor(sourceStr) {
		super(tokenTypes.variable, sourceStr)
		this.name = sourceStr.toLowerCase()
		this.toString = () => this.value === null ? "null" : this.value.toString()
		this.value = null
	}
}

function createDataToken(tokenType, sourceStr) {
	switch(tokenType) {
		case tokenTypes.variable:
			return new VariableType(sourceStr)
		case tokenTypes.realNumber:
			return new NumberType(+sourceStr, 0)
		case tokenTypes.i:
			return new NumberType(0, 1)
		default:
			return new DataType(tokenType, sourceStr)
	}
}

module.exports = {
	tokenTypes,
	createDataToken,
	DataType,
	NumberType,
	VariableType
}
