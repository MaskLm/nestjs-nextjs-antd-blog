import seedrandom from 'seedrandom';

function generateRandom(n: number, seed: string): string {
  const rng = seedrandom(seed);
  let randomNum = '';
  for (let i = 0; i < n; i++) {
    randomNum += Math.floor(rng() * 10);
  }
  return randomNum;
}

export default generateRandom;
