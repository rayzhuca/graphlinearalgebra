export const eigval = (matrix) => {
	let output = [];
	
	for (let i = 0; i < 50; i++) {
		const qr = math.qr(matrix);
		matrix = math.multiply(qr.R, qr.Q);
	}
	
	for (let i = 0; i < matrix.length; i++) {
		output.push(matrix[i][i]);
	}
	
	return output;
};

export const rref = (matrix) => {
	let output = [...matrix];
	output.map((v) => v.map((w) => math.bignumber(w)));
	
	for (let j = 0; j < output.length - 1; j++) {
		output[j] = math.divide(output[j], output[j][j]);
		
		if (output[j][j]) {
			for (let i = 0; i < output.length; i++) {
				if (i != j) {
					output[i] = math.subtract(
							output[i],
							math.multiply(output[j], output[i][j])
						);
				}
			}
		}
	}
		
	output[output.length - 1] = math.divide(
		output[output.length - 1],
		output[output.length - 1][output.length - 1]
		);
		return output;
};

let lastMatrix = 2, lastOutput = 3;
		
export const eig = (matrix) => {
	if (math.deepEqual(matrix, lastMatrix)) {
		return lastOutput;
	}

	let output = {
		eigval: [],
		eigvec: [],
	};
	
	for (let i = 0; i < matrix.length; i++) {
		const s = eigval(matrix);
		output.eigval = [...s];
		const si = s[i];
		const Atilde = math.subtract(
				matrix,
				math.multiply(si, math.diag(math.ones(s.length).toArray()))
			);
		const Atilde_red = rref(Atilde);
		const vi = [];
		Atilde_red.forEach((v) => vi.push(v[v.length - 1]));
		const vj = math.divide(vi, math.norm(vi));
		output.eigvec.push(vj);
	}

	lastMatrix = matrix;
	lastOutput = output;
	
	return output;
};
	