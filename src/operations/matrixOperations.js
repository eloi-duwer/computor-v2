const { MatrixType, NumberType, tokenTypes } = require(__dirname + '/../tokens.js')

const {
	addComplex,
	subComplex,
	multComplex,
	divComplex
} = require(__dirname + '/numberOperations.js')

function findTokens(tokens, operationType) {
	let i = 2
	while (i < tokens.length) {
		if (tokens[i - 1].type === operationType) {
			//One of the two tokens must be a matrix, and the other can be a matrix or a complex number, but both cant be complex numbers
			if (tokens[i - 2].type === tokenTypes.matrix) {
				if (tokens[i].type === tokenTypes.matrix || tokens[i].type === tokenTypes.complexNumber)
					return [i - 2, 3]
			}
			else if (tokens[i].type === tokenTypes.matrix) {
				if (tokens[i - 2].type === tokenTypes.complexNumber)
					return [i - 2, 3]
			}
		}
		i++
	}
	return [-1, -1]
}

/**
 * Returns a Matrix filled with number, that have the same size as the model
 */
function matrixify(number, model) {
	return new MatrixType(model.values.map(line => line.map(_row => number)))
}

function matrixError(a, b, msg) {
	console.error(msg)
	console.error(a.toString())
	console.error("and")
	console.error(b.toString())
	return null
}

const matrixAddition = {
	pattern: tokens => findTokens(tokens, tokenTypes.plus),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos]
		let b = tokens[pos + 2]
		//The pattern guarantees that at least one of the two tokens will be a matrix
		if (a.type === tokenTypes.complexNumber)
			a = matrixify(a, b)
		else if (b.type === tokenTypes.complexNumber)
			b = matrixify(b, a)
		if (a.nb_lines !== b.nb_lines || a.nb_columns !== b.nb_columns) {
			return matrixError(a, b, "Matrixes don't have the same dimension:")
		}
		return new MatrixType(a.values.map((line, i) => line.map((row, j) => addComplex(row, b.values[i][j]))))
	}
}

const matrixSubstraction = {
	pattern: tokens => findTokens(tokens, tokenTypes.minus),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos]
		let b = tokens[pos + 2]
		//The pattern guarantees that at least one of the two tokens will be a matrix
		if (a.type === tokenTypes.complexNumber)
			a = matrixify(a, b)
		else if (b.type === tokenTypes.complexNumber)
			b = matrixify(b, a)
		if (a.nb_lines !== b.nb_lines || a.nb_columns !== b.nb_columns) {
			return matrixError(a, b, "Matrixes don't have the same dimension:")
		}
		return new MatrixType(a.values.map((line, i) => line.map((row, j) => subComplex(row, b.values[i][j]))))
	}
}

const matrixClassicMultiplication = {
	pattern: tokens => findTokens(tokens, tokenTypes.mult),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos]
		let b = tokens[pos + 2]
		//The pattern guarantees that at least one of the two tokens will be a matrix
		if (a.type === tokenTypes.complexNumber)
			a = matrixify(a, b)
		else if (b.type === tokenTypes.complexNumber)
			b = matrixify(b, a)
		if (a.nb_lines !== b.nb_lines || a.nb_columns !== b.nb_columns) {
			return matrixError(a, b, "Matrixes don't have the same dimension:")
		}
		return new MatrixType(a.values.map((line, i) => line.map((row, j) => multComplex(row, b.values[i][j]))))
	}
}

const matrixDivision = {
	pattern: tokens => findTokens(tokens, tokenTypes.div),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos]
		let b = tokens[pos + 2]
		//The pattern guarantees that at least one of the two tokens will be a matrix
		if (a.type === tokenTypes.complexNumber)
			a = matrixify(a, b)
		else if (b.type === tokenTypes.complexNumber)
			b = matrixify(b, a)
		if (a.nb_lines !== b.nb_lines || a.nb_columns !== b.nb_columns) {
			return matrixError(a, b, "Matrixes don't have the same dimension:")
		}
		if (b.values.some(line => line.some(number => number.complex === 0 && number.real === 0))) {
			console.error("The second matrix has 0 elements in it that would result in a division by zero")
			console.error(b.toString())
			return null
		}
		return new MatrixType(a.values.map((line, i) => line.map((row, j) => divComplex(row, b.values[i][j]))))
	}
}

const matrixMultiplication = {
	pattern: tokens => {
		//Special case: Multiplication is implicit when two matrixes are next to each other
		let i = 1;
		while (i < tokens.length) {
			if (tokens[i].type === tokenTypes.matrix && tokens[i - 1].type === tokenTypes.matrix)
				return [i - 1, 2]
			else if (tokens[i].type === tokenTypes.matrix && tokens[i - 1].type === tokenTypes.matrixMultiplication && i >= 2 && tokens[i - 2].type === tokenTypes.matrix)
				return [i - 2, 3]
			i++;
		}
		return [-1 , -1]
	},
	evaluate: ([pos, len], tokens, _variables) => {
		let a = tokens[pos]
		let b = tokens[pos + len - 1]
		if (a.nb_columns !== b.nb_lines)
			return matrixError(a, b, "For a multiplication, the number of columns in the first matrix must equal to the number of lines in the second matrx")
		let ret = new Array(a.nb_lines).fill(new Array(b.nb_columns).fill()) 
		return new MatrixType(ret.map((line, i) =>
			line.map((_, j) =>
				new Array(a.nb_columns).fill().reduce((acc, _, index) =>
					addComplex(acc, multComplex(a.values[i][index], b.values[index][j]))
					, new NumberType(0, 0)
				)
			))
		)
	}
}

module.exports = {
	matrixAddition,
	matrixSubstraction,
	matrixClassicMultiplication,
	matrixDivision,
	matrixMultiplication
}
