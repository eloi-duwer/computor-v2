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
	matrix: "matrix",
	function: "function",
	polynomial: "polynomial"
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
		this.toString = () => /*this.value === null ? this.sourceStr : this.value.toString()*/ this.name
		this.value = null
	}
}

class MatrixType extends DataType {
	constructor(values) {
		let sourceStr = '[' + values.map(line => {
			return '[ ' + line.map(column => {
				return column.toString()
			}).join(' , ') + ' ]'
		}).join(' ; ') + ']'
		super(tokenTypes.matrix, sourceStr)
		this.nb_lines = values.length
		this.nb_columns = this.nb_lines > 0 ? values[0].length : 0
		this.values = values
	}
}

class FunctionType extends DataType {
	constructor(name, vars, tokens) {
		let sourceStr = tokens.map(t => t.toString()).join(' ')
		super(tokenTypes.function, sourceStr)
		this.name = name
		this.vars = vars
		this.tokens = tokens		
	}
}

class PolynomialType extends DataType {
	constructor(name, varName, monomes) {
		let sourceStr = Object.keys(monomes).sort((a, b) => +b - +a).map((k, i) => {
			let ret = ""
			if (i > 0 && (monomes[k].real >= 0 || monomes[k].real === 0 && monomes[k].complex >= 0))
				ret += "+ "
			ret += monomes[k].toString()
			if (+k !== 0) {
				ret += varName;
				if (+k > 1)
					ret += "^" + k
			}
			return ret
		}).join(" ")
		super(tokenTypes.polynomial, sourceStr)
		this.name = name
		this.monomes = monomes
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
	VariableType,
	MatrixType,
	FunctionType,
	PolynomialType
}
