const pidFromPort = require('pid-from-port');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

module.exports = {
	unixKill,
	win32Kill
};

async function unixKill({ inputArray, opts }) {
	const promises = inputArray.map(killPortProcess);
	return Promise.all(promises);

	async function killPortProcess(input) {
		return new Promise((resolve, reject) => {
			const command = `lsof -i tcp:${input} | grep LISTEN | awk '{print $2}' | xargs kill -9`;
			exec(command, (err, stdout, stderr) => {
				if (err) {
					return reject(err);
				}
				console.log(`Successfully terminated process running on port ${input}`);
				resolve();
			});
		});
	}
}

async function win32Kill({ inputArray, opts }) {
	const pids = [];
	for (let i = 0; i < inputArray.length; i++) {
		const pid = await pidFromPort(inputArray[i]);
		pids.push(pid);
	}

	const { stderr, stdout } = await execAsync(`TASKKILL /f /t /pid ${pids.join(' ')}`);
	console.log('stderr: ', stderr);
	console.log('stdout', stdout);
}