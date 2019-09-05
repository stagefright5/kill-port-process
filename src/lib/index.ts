import { arrayifyInput, InvalidInputError, IsInputValid, mergeOptions, Options } from './helpers';
import { Killer } from './killer';

export async function killPortProcess(input: any, options: Options = {}) {

	try {
		const validInput = IsInputValid(input);

		if (!validInput) {
			throw new InvalidInputError('Invalid input', input);
		}

		const mergedOptions = mergeOptions(options);
		const toNumber = (value: string | number) => Number(value);
		const ports = arrayifyInput(input).map(toNumber);

		const killer = new Killer(ports, mergedOptions);
		await killer.kill();
	} catch (error) {
		throw error;
	}
}
